import os
import requests
from .base_provider import LLMProvider

class OpenAIProvider(LLMProvider):
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY", "")
        self.url = "https://api.openai.com/v1/chat/completions"

    def generate_text(self, prompt: str) -> str:
        if not self.api_key:
            return "MOCK_RESPONSE: OpenAI API Key not found. Please set OPENAI_API_KEY environment variable."

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }
        
        try:
            response = requests.post(self.url, headers=headers, json=data)
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Error from OpenAI: {str(e)}"
