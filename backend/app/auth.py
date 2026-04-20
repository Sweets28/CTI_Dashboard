from passlib.context import CryptContext
from jose import jwt 
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os


load_dotenv()
print("ENV PATH:", os.path.abspath(".env"))
print("ALGORITHM:", os.getenv("ALGORITHM"))
print("SECRET_KEY:", os.getenv("SECRET_KEY"))


# SECRET_KEY = os.getenv("SECRET_KEY")
# ALGORITHM = os.getenv("ALOGORITHM")
# ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password[:72])

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain[:72], hashed)

def create_access_token(data: dict) -> str:
    secret_key = os.getenv("SECRET_KEY")
    algorithm = os.getenv("ALGORITHM", "HS256")  # fallback to HS256
    expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm=algorithm)

