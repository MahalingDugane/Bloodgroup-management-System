import sys
from app.database.connection import SessionLocal
# Import from app.models or the original user module
try:
    from app.models import User
except ImportError:
    from app.models.user import User

from app.utils.security import hash_password

def create_admin(name, email, phone, password):
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            existing.role = "ADMIN"
            db.commit()
            print(f"Existing user '{email}' upgraded to ADMIN successfully.")
            return

        admin = User(
            full_name=name,
            email=email,
            phone=phone,
            password_hash=hash_password(password),
            role="ADMIN"
        )
        db.add(admin)
        db.commit()
        print(f"Admin account '{email}' created successfully.")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python create_admin.py <Name> <Email> <Phone> <Password>")
        sys.exit(1)
    create_admin(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])