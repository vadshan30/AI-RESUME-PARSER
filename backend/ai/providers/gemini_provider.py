import os
import json
from backend.services.gemini_service import gemini_service
from .base_provider import LLMProvider

class GeminiProvider(LLMProvider):
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")

    def generate_text(self, prompt: str) -> str:
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is missing. Cannot perform AI analysis without it.")

        # Use our robust, centrally-managed SDK service instead of raw HTTP requests
        response = gemini_service.generate_content(prompt)

        if not response:
            raise RuntimeError("Gemini returned an empty response.")

        # gemini_service returns JSON strings with {"success": false, ...} on errors
        # Detect and convert these to exceptions so callers never receive error JSON as text
        try:
            parsed = json.loads(response)
            if isinstance(parsed, dict):
                if parsed.get("success") is False or parsed.get("fallback") is True:
                    error_msg = parsed.get("message", "AI provider returned an error response.")
                    raise RuntimeError(f"Gemini API Error: {error_msg}")
        except (json.JSONDecodeError, TypeError):
            # Not JSON — valid plain text response, return it
            pass

        return response
