import os
import json
import time
import httpx
import ssl
import socket
import traceback
from typing import Optional, Dict, Any
from google import genai
from google.genai import types
from google.genai import errors

from backend.core.config import settings
from backend.core.logger import StructuredLogger

logger = StructuredLogger.get_logger("ai_manager")

class AIManager:
    """
    Centralized AI Integration Layer.
    Strictly handles Gemini initialization, validation, fail-fast network retries, and JSON parsing.
    """
    
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
        self.primary_model = settings.GEMINI_MODEL
        self.timeout = settings.AI_TIMEOUT
        self.max_retries = 2
        
        # Initialize client
        try:
            self.client = genai.Client(
                api_key=self.api_key,
                http_options={'timeout': float(self.timeout)}
            )
        except Exception as e:
            logger.error(f"Failed to initialize Gemini Client: {e}")
            self.client = None

    def _clean_json_response(self, text: str) -> str:
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        return text.strip()

    def generate_json(self, prompt: str, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        """
        Executes a prompt expecting a JSON response. 
        Implements short-circuit network failure logic.
        """
        if not self.client:
            return {"error": True, "message": "AI Client not initialized. Check API Key."}

        start_time = time.time()
        last_error = "Unknown Error"

        for attempt in range(self.max_retries + 1):
            try:
                config_kwargs = {"temperature": 0.2}
                if system_instruction:
                    config_kwargs["system_instruction"] = system_instruction
                    
                response = self.client.models.generate_content(
                    model=self.primary_model,
                    contents=prompt,
                    config=types.GenerateContentConfig(**config_kwargs)
                )
                
                execution_time = time.time() - start_time
                StructuredLogger.log_ai_interaction(self.primary_model, len(prompt), len(response.text), execution_time, True)
                
                cleaned_text = self._clean_json_response(response.text)
                return json.loads(cleaned_text)
                
            except (ssl.SSLError, httpx.ConnectTimeout, httpx.ReadTimeout, socket.timeout) as e:
                StructuredLogger.log_ai_interaction(self.primary_model, len(prompt), 0, time.time() - start_time, False, f"Network Error: {str(e)}")
                last_error = "Network/SSL timeout."
                
                if attempt < self.max_retries:
                    time.sleep(2 * (2 ** attempt))
                    continue
                break # Fail fast on network
                
            except errors.APIError as e:
                StructuredLogger.log_ai_interaction(self.primary_model, len(prompt), 0, time.time() - start_time, False, f"API Error: {str(e)}")
                code = getattr(e, 'code', 'Unknown')
                if code == 429 and attempt < self.max_retries:
                    time.sleep(5)
                    continue
                last_error = f"API Error {code}: {getattr(e, 'message', str(e))}"
                break
                
            except json.JSONDecodeError as e:
                StructuredLogger.log_ai_interaction(self.primary_model, len(prompt), len(response.text), time.time() - start_time, False, f"JSON Decode Error")
                last_error = "AI returned invalid JSON format."
                break
                
            except Exception as e:
                err_str = str(e).lower()
                if "timeout" in err_str or "ssl" in err_str or "connection" in err_str:
                    if attempt < self.max_retries:
                        time.sleep(2)
                        continue
                    last_error = "Network timeout."
                else:
                    last_error = f"Unexpected AI Error: {str(e)}"
                break

        return {"error": True, "message": last_error}

ai_manager = AIManager()
