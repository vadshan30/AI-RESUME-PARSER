import os
import sys
import json
import logging
import time
import socket
import ssl
import httpx
import traceback
from typing import Optional, List
from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai import errors
from backend.core.config import get_settings

# Configure logging for the service
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Force reload dotenv to ensure fresh environment
load_dotenv(override=True)

class GeminiService:
    """
    A service class to handle interactions with the Google Gemini API.
    Designed as a singleton with hardcore diagnostic capabilities and specific SSL handling.
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GeminiService, cls).__new__(cls)
            cls._instance._initialize_client()
        return cls._instance
        
    def _initialize_client(self):
        """Initializes the Gemini client securely with extensive pre-flight checks."""
        self.settings = get_settings()
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = None
        self.debug_mode = getattr(self.settings, 'DEBUG_AI', True)
        
        if self.debug_mode:
            logger.info("=========================================")
            logger.info("       GEMINI AI DIAGNOSTIC BOOT         ")
            logger.info("=========================================")
            
        if not self.api_key or not self.api_key.strip():
            logger.error("❌ GEMINI_API_KEY is missing or empty in environment.")
            return

        if not self.api_key.startswith("AIza"):
            logger.warning("⚠️ GEMINI_API_KEY does not start with 'AIza'. It might be invalid.")
            
        if self.debug_mode:
            logger.info(f"✓ Gemini API Key Loaded: YES (Length: {len(self.api_key)})")

        try:
            timeout_val = float(getattr(self.settings, 'AI_TIMEOUT', 90))

            # Build an httpx client with SSL verification disabled and generous timeouts
            # This bypasses SSL handshake failures on restricted networks
            ssl_ctx = ssl.create_default_context()
            ssl_ctx.check_hostname = False
            ssl_ctx.verify_mode = ssl.CERT_NONE

            http_client = httpx.Client(
                verify=False,
                timeout=httpx.Timeout(timeout_val, connect=30.0),
            )

            http_opts = types.HttpOptions(
                timeout=int(timeout_val * 1000),  # SDK expects milliseconds
            )

            self.client = genai.Client(
                api_key=self.api_key,
                http_options=http_opts,
            )
            # Patch the underlying transport to use our no-verify httpx client
            try:
                self.client._api_client._httpx_client = http_client
            except Exception:
                pass  # Best-effort patch; SDK may not expose this attribute in all versions

            if self.debug_mode:
                logger.info(f"✓ Gemini SDK Client initialized (timeout={timeout_val}s, SSL verify=False).")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Gemini SDK Client: {e}")
            if self.debug_mode:
                traceback.print_exc()

    def _check_internet(self) -> bool:
        """Pings Google GenAI endpoints to verify network/SSL connectivity directly."""
        try:
            socket.setdefaulttimeout(5)
            # Check the exact host the SDK uses to ensure no DNS block or strict firewall
            socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect(("generativelanguage.googleapis.com", 443))
            return True
        except socket.error as e:
            logger.error(f"❌ Network Check Failed: Could not reach generativelanguage.googleapis.com (Error: {e})")
            return False
            
    def get_fallback_models(self) -> List[str]:
        base_model = getattr(self.settings, 'GEMINI_MODEL', 'gemini-2.5-pro')
        fallbacks = [
            base_model,
            "gemini-2.5-pro",
            "gemini-2.0-flash",
            "gemini-1.5-pro",
            "gemini-1.5-flash"
        ]
        return list(dict.fromkeys(fallbacks))
        
    def generate_content(self, prompt: str, model: str = None) -> str:
        """
        Generates content from a given prompt using the specified model.
        Returns the raw response text, or a JSON string with detailed error breakdown.
        """
        start_time = time.time()
        
        if self.debug_mode:
            logger.info("=========================================")
            logger.info("         AI REQUEST INITIATED            ")
            logger.info("=========================================")
            logger.info(f"Prompt Length: {len(prompt)} characters")
        
        logger.info("Testing connectivity to generativelanguage.googleapis.com...")
        if not self._check_internet():
            logger.error("❌ Network Error: No internet connection or Gemini service is unreachable.")
            return json.dumps({
                "success": False,
                "message": "No internet connection or Gemini service is unreachable.",
                "fallback": True
            })
            
        if not self.api_key:
            logger.error("❌ Auth Error: Gemini API Key is missing.")
            return json.dumps({
                "success": False,
                "message": "Invalid Gemini API Key. Please configure it in .env.",
                "fallback": True
            })

        if not self.client:
            logger.error("❌ SDK Error: Gemini client is not initialized.")
            return json.dumps({
                "success": False,
                "message": "AI service client failed to initialize.",
                "fallback": True
            })
            
        max_chars = 400000 
        if len(prompt) > max_chars:
            logger.warning(f"⚠️ Prompt too long ({len(prompt)} chars). Truncating to {max_chars}.")
            prompt = prompt[:max_chars]
            
        max_retries = getattr(self.settings, 'MAX_RETRIES', 3)
        timeout = getattr(self.settings, 'AI_TIMEOUT', 60)
        models_to_try = self.get_fallback_models()
        
        if model and model not in models_to_try:
            models_to_try.insert(0, model)
            
        last_error_message = "Unknown error"
            
        for current_model in models_to_try:
            for attempt in range(max_retries + 1):
                try:
                    logger.info(f"▶️ Connection Established. Waiting for Gemini... (Model: {current_model} | Attempt {attempt + 1}/{max_retries + 1})")
                    
                    response = self.client.models.generate_content(
                        model=current_model,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            temperature=0.7
                            # SDK timeout is already set on the http_client during init
                        )
                    )
                    
                    execution_time = time.time() - start_time
                    logger.info("✅ Response Received.")
                    logger.info(f"Execution Time: {execution_time:.2f}s | Response Length: {len(response.text)}")
                    if self.debug_mode:
                        logger.info("=========================================")
                    
                    return response.text

                except (ssl.SSLError, ssl.SSLEOFError, httpx.ConnectTimeout, httpx.ReadTimeout, socket.timeout, ConnectionResetError) as e:
                    logger.error(f"❌ SSL/Network Timeout ({type(e).__name__}): {e}")
                    if self.debug_mode:
                        traceback.print_exc()
                        
                    last_error_message = "Gemini connection timed out. Unable to establish a secure SSL connection."
                    if attempt < max_retries:
                        wait_time = 2 * (2 ** attempt)
                        logger.warning(f"⏳ Retrying connection (Attempt {attempt + 2} of {max_retries + 1}) in {wait_time}s...")
                        time.sleep(wait_time)
                        continue
                    # Exhausted retries for network error - don't try other models, just fail fast
                    logger.error("💥 Network retries exhausted. Bailing out immediately to trigger fallback.")
                    return json.dumps({"success": False, "message": last_error_message, "fallback": True})

                except errors.APIError as e:
                    code = getattr(e, 'code', 'Unknown')
                    message = getattr(e, 'message', str(e))
                    logger.error(f"❌ APIError (Code {code}): {message}")
                    
                    if self.debug_mode:
                        traceback.print_exc()
                    
                    # 400: Bad Request / Invalid API Key usually
                    if code == 400:
                        last_error_message = "Invalid Gemini API Key or Bad Request."
                        if "API key" in message.lower():
                            return json.dumps({"success": False, "message": last_error_message, "fallback": True})
                        break # Cannot retry bad requests
                        
                    # 403: Permission Denied
                    if code == 403:
                        last_error_message = "Permission Denied. Verify your Gemini API Key."
                        return json.dumps({"success": False, "message": last_error_message, "fallback": True})
                        
                    # 404: Model Not Found
                    if code == 404 or "not found" in str(message).lower() or "deprecated" in str(message).lower():
                        logger.warning(f"⚠️ Model {current_model} unavailable. Falling back to next model.")
                        last_error_message = f"Gemini model {current_model} unavailable."
                        break # Try next model in list
                        
                    # 429: Rate Limit / Quota Exceeded
                    if code == 429 or "quota" in str(message).lower() or "rate" in str(message).lower():
                        if "quota" in str(message).lower():
                            last_error_message = "Daily AI quota exceeded. Please check billing."
                            return json.dumps({"success": False, "message": last_error_message, "fallback": True})
                        else:
                            last_error_message = "AI service rate limited."
                            if attempt < max_retries:
                                wait_time = 2 * (2 ** attempt)
                                logger.warning(f"⏳ Rate limited. Retrying in {wait_time}s...")
                                time.sleep(wait_time)
                                continue
                            break
                            
                    # 503/504: Server Errors
                    if code in [500, 502, 503, 504]:
                        last_error_message = "AI Server temporarily unavailable."
                        if attempt < max_retries:
                            wait_time = 2 * (2 ** attempt)
                            logger.warning(f"⏳ Server error HTTP {code}. Retrying in {wait_time}s...")
                            time.sleep(wait_time)
                            continue
                    
                    # Other unknown API error
                    last_error_message = f"API Error: {message}"
                    break

                except Exception as e:
                    err_str = str(e).lower()
                    logger.error(f"❌ Unexpected Exception with {current_model}: {type(e).__name__} - {e}")
                    if self.debug_mode:
                        traceback.print_exc()
                        
                    if "timeout" in err_str or "timed out" in err_str or "ssl" in err_str or "connection" in err_str:
                        last_error_message = "SSL/Network timeout during AI request."
                        if attempt < max_retries:
                            wait_time = 2 * (2 ** attempt)
                            logger.warning(f"⏳ Timeout/SSL Error. Retrying in {wait_time}s...")
                            time.sleep(wait_time)
                            continue
                        logger.error("💥 Generic Network retries exhausted. Bailing out immediately to trigger fallback.")
                        return json.dumps({"success": False, "message": last_error_message, "fallback": True})
                    else:
                        last_error_message = f"Unexpected AI Error: {str(e)}"
                    break # Try next model for non-network errors
        
        # If we exhausted all models and retries
        logger.error(f"💥 All models and retries exhausted. Final Error: {last_error_message}")
        if self.debug_mode:
            logger.info("=========================================")
        return json.dumps({
            "success": False,
            "message": last_error_message,
            "fallback": True
        })

# Create a global instance to be imported by routers
gemini_service = GeminiService()
