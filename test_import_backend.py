import sys
import traceback

try:
    from backend.main import app
    print("Backend imported successfully.")
except Exception as e:
    print("Backend import failed:")
    traceback.print_exc()
