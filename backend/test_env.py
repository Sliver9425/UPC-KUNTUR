import os
from dotenv import load_dotenv

load_dotenv()

print("B2_KEY_ID:", os.getenv("B2_KEY_ID"))
print("B2_SECRET_KEY:", os.getenv("B2_SECRET_KEY"))
print("B2_BUCKET:", os.getenv("B2_BUCKET"))
