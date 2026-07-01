import os
import requests
from .base_provider import LLMProvider

class OllamaProvider(LLMProvider):
    def __init__(self):
        self.url = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
        self.model = os.getenv("OLLAMA_MODEL", "llama2")

    def generate_text(self, prompt: str) -> str:
        data = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        
        try:
            response = requests.post(self.url, json=data)
            response.raise_for_status()
            result = response.json()
            return result.get("response", "")
        except Exception as e:
            return f"Error from Ollama: {str(e)}\nPlease ensure Ollama is running at {self.url} with model {self.model}"
