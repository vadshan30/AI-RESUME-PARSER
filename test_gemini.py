from backend.services.gemini_service import gemini_service
import sys

if __name__ == "__main__":
    if not gemini_service.client:
        print("Failed to initialize the Gemini client. Check the API key and dependencies.")
        sys.exit(1)
        
    print("Gemini client initialized successfully!")
    print("Testing connection...")
    
    response = gemini_service.generate_content("Say 'Hello, World! I am Gemini.'")
    
    if response:
        print("Success! Gemini response:")
        print(response)
    else:
        print("Failed to get a response from Gemini.")
