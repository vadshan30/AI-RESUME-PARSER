from abc import ABC, abstractmethod

class LLMProvider(ABC):
    @abstractmethod
    def generate_text(self, prompt: str) -> str:
        """
        Generate text based on the given prompt.
        """
        pass
