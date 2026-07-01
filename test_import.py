import sys
import traceback

try:
    from backend.main import app
    print("Backend loaded successfully.")
except Exception as e:
    print("Error loading backend:")
    traceback.print_exc()
