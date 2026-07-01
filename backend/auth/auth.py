from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from backend.database import get_db
from backend.models import User
from backend.schemas import UserCreate, UserResponse, Token, UserLogin
from backend.auth.security import get_password_hash, verify_password, create_access_token, get_current_user, SECRET_KEY, ALGORITHM
from pydantic import BaseModel
from jose import jwt, JWTError
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["Authentication"])

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """
    Registers a new user in the MySQL database.
    """
    # Check if user exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticates a user using standard JSON body.
    """
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    if not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    # Create JWT Token
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Returns the currently authenticated user.
    """
    return current_user

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # Prevent email enumeration by returning a generic success message
        return {"message": "If an account with that email exists, a reset link has been generated."}
    
    # Generate a 15-minute token for password reset
    reset_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=15))
    
    # MOCK EMAIL SENDING: In a real app, you would send an email via SMTP here.
    # For testing, we return the token directly so the frontend can mock the flow.
    reset_link = f"http://localhost:5173/reset-password?token={reset_token}"
    print(f"MOCK EMAIL SENT TO {user.email}: Password Reset Link: {reset_link}")
    
    return {"message": "Password reset instructions generated.", "dev_reset_link": reset_link}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(req.token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=400, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=400, detail="Token has expired or is invalid")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Update password
    user.password_hash = get_password_hash(req.new_password)
    db.commit()
    
    return {"message": "Password has been successfully reset."}
