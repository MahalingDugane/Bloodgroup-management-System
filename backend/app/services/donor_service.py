from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.donor import Donor
from app.schemas.donor import DonorCreate, DonorUpdateAvailability

def register_donor(db: Session, donor_in: DonorCreate, user_id: int) -> Donor:
    existing = db.query(Donor).filter(Donor.user_id == user_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already registered as a donor."
        )

    donor = Donor(
        user_id=user_id,
        full_name=donor_in.full_name,
        blood_group=donor_in.blood_group,
        phone=donor_in.phone,
        age=donor_in.age,
        gender=donor_in.gender,
        address=donor_in.address,
        city=donor_in.city,
        state=donor_in.state,
        last_donation_date=donor_in.last_donation_date,
        availability=donor_in.availability
    )
    db.add(donor)
    db.commit()
    db.refresh(donor)
    return donor

def search_donors(
    db: Session,
    blood_group: Optional[str] = None,
    city: Optional[str] = None,
    availability: Optional[bool] = None
) -> List[Donor]:
    query = db.query(Donor)
    if blood_group:
        query = query.filter(Donor.blood_group == blood_group)
    if city:
        query = query.filter(Donor.city.ilike(f"%{city}%"))
    if availability is not None:
        query = query.filter(Donor.availability == availability)
    return query.order_by(Donor.created_at.desc()).all()

def get_donor_by_user_id(db: Session, user_id: int) -> Optional[Donor]:
    return db.query(Donor).filter(Donor.user_id == user_id).first()

def update_donor_availability(db: Session, user_id: int, update_in: DonorUpdateAvailability) -> Donor:
    donor = get_donor_by_user_id(db, user_id)
    if not donor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donor profile not found.")
    
    donor.availability = update_in.availability
    db.commit()
    db.refresh(donor)
    return donor