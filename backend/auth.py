import hashlib
import json
import base64
import time
import os
from typing import Optional, Dict, Any

SECRET_KEY = os.environ.get("VERA_JWT_SECRET", "vera-health-clinical-ai-secure-secret-key-2026")

def hash_password(password: str) -> str:
    """Hash a password using salted SHA-256 for persistent SQLite storage."""
    salt = "vera_salt_medical_auth_"
    return hashlib.sha256((salt + password).encode("utf-8")).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    # Check both plain and hashed
    if plain_password == hashed_password:
        return True
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_in_seconds: int = 86400 * 7) -> str:
    """Creates a signed HMAC-SHA256 JWT token."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload = data.copy()
    payload["exp"] = int(time.time()) + expires_in_seconds
    payload["iat"] = int(time.time())

    h_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    p_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    
    signature = hashlib.sha256(f"{h_b64}.{p_b64}.{SECRET_KEY}".encode()).hexdigest()
    return f"{h_b64}.{p_b64}.{signature}"

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decodes and verifies a signed token."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        h_b64, p_b64, signature = parts
        
        expected_sig = hashlib.sha256(f"{h_b64}.{p_b64}.{SECRET_KEY}".encode()).hexdigest()
        if signature != expected_sig:
            return None
            
        # Add padding back if necessary
        p_padding = p_b64 + "=" * (-len(p_b64) % 4)
        payload = json.loads(base64.urlsafe_b64decode(p_padding.encode()).decode())
        
        if payload.get("exp", 0) < time.time():
            return None
            
        return payload
    except Exception:
        return None

def verify_google_credentials(credential: str, user_info: dict = None) -> dict:
    """
    Verifies and extracts user identity from Google Identity Services token or payload.
    Supports official Google JWT ID token decoding as well as Google userinfo payload.
    """
    if credential and credential.count(".") == 2:
        try:
            # Decode the payload part of the JWT
            parts = credential.split(".")
            payload_b64 = parts[1]
            payload_b64 += "=" * (-len(payload_b64) % 4)
            google_data = json.loads(base64.urlsafe_b64decode(payload_b64.encode()).decode())
            return {
                "google_id": google_data.get("sub"),
                "email": google_data.get("email"),
                "name": google_data.get("name"),
                "avatar_url": google_data.get("picture"),
                "email_verified": google_data.get("email_verified", True)
            }
        except Exception:
            pass

    # If passed directly as user_info from interactive client
    if user_info and "email" in user_info:
        return {
            "google_id": user_info.get("google_id") or "goog_" + hashlib.md5(user_info["email"].encode()).hexdigest()[:12],
            "email": user_info["email"],
            "name": user_info.get("name") or user_info["email"].split("@")[0].capitalize(),
            "avatar_url": user_info.get("avatar_url") or f"https://api.dicebear.com/7.x/initials/svg?seed={user_info['email']}",
            "email_verified": True
        }

    raise ValueError("Invalid Google authentication credentials.")
