import inspect
from google.genai import Client

print(inspect.signature(Client.__init__))
