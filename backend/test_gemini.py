import os
import sys
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"GEMINI_API_KEY Loaded: {'YES' if api_key else 'NO'} (Length: {len(api_key) if api_key else 0})")

try:
    from google import genai
    from google.genai import types
    
    print("Google GenAI SDK imported successfully.")
    
    if not api_key:
        print("Cannot test without API key.")
        sys.exit(1)
        
    client = genai.Client(api_key=api_key)
    print("Client initialized. Testing generate_content...")
    
    response = client.models.generate_content(
        model="gemini-1.5-pro",
        contents="Hello, are you working?",
    )
    print(f"SUCCESS: {response.text}")
    
except Exception as e:
    print("FAILED with Exception:")
    import traceback
    traceback.print_exc()
