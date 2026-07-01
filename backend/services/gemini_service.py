import os
import logging
from typing import Optional
from dotenv import load_dotenv
from google import genai
from google.genai import errors

# Configure logging for the service
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

class GeminiService:
    """
    A service class to handle interactions with the Google Gemini API.
    This class is designed as a singleton to ensure the client is initialized only once.
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GeminiService, cls).__new__(cls)
            cls._instance._initialize_client()
        return cls._instance
        
    def _initialize_client(self):
        """Initializes the Gemini client securely."""
        self.api_key = os.environ.get("GEMINI_API_KEY")
        self.client = None
        
        if not self.api_key:
            logger.error("GEMINI_API_KEY environment variable is missing.")
            return

        try:
            self.client = genai.Client(api_key=self.api_key)
            logger.info("Gemini client initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini client: {e}")
            
    def generate_content(self, prompt: str, model: str = "gemini-2.5-flash") -> Optional[str]:
        """
        Generates content from a given prompt using the specified model.
        
        Args:
            prompt (str): The input prompt for the AI.
            model (str): The Gemini model to use (default: gemini-2.5-flash).
            
        Returns:
            Optional[str]: The generated text response, or None if an error occurs.
        """
        if not self.client:
            logger.error("Gemini client is not initialized. Cannot generate content.")
            return None
            
        try:
            response = self.client.models.generate_content(
                model=model,
                contents=prompt
            )
            return response.text
        except errors.APIError as e:
            logger.error(f"Gemini API Error: {e.message} (Code: {e.code})")
        except Exception as e:
            logger.error(f"An unexpected error occurred during content generation: {e}")
            
        return None

# Create a global instance to be imported by routers
gemini_service = GeminiService()
