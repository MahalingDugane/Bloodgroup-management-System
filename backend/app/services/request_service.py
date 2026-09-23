from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.blood_request import BloodRequest
from app.models.blood_stock import BloodStock
from app.schemas.blood_request import BloodRequestCreate, BloodRequestStatusUpdate

def create_blood_request(db: Session, req_in: BloodRequestCreate, user_id: int) -> BloodRequest:
    req = BloodRequest(
        user_id=user_id,
        patient_name=req_in.patient_name,
        blood_group=req_in.blood_group,
        required_units=req_in.required_units,
        hospital_name=req_in.hospital_name,
        hospital_address=req_in.hospital_address,
        city=req_in.city,
        contact_number=req_in.contact_number,
        urgency=req_in.urgency,
        reason=req_in.reason,
        status="Pending"
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return req

def get_user_requests(db: Session, user_id: int) -> List[BloodRequest]:
    return db.query(BloodRequest).filter(BloodRequest.user_id == user_id).order_by(BloodRequest.created_at.desc()).all()

def get_all_requests(db: Session) -> List[BloodRequest]:
    return db.query(BloodRequest).order_by(BloodRequest.created_at.desc()).all()

def get_request_by_id(db: Session, request_id: int) -> BloodRequest:
    req = db.query(BloodRequest).filter(BloodRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blood request not found.")
    return req

def update_request_status(db: Session, request_id: int, update_in: BloodRequestStatusUpdate) -> BloodRequest:
    req = get_request_by_id(db, request_id)
    prev = req.status
    target = update_in.status

    if prev == target:
        return req

    # Prevent illegal terminal transition
    if prev == "Completed" and target != "Completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot modify a request that has already been Completed."
        )

    # Concurrency safe pessimistic row locking
    stock = db.query(BloodStock).filter(BloodStock.blood_group == req.blood_group).with_for_update().first()
    if not stock:
        stock = BloodStock(blood_group=req.blood_group, available_units=0)
        db.add(stock)
        db.flush()

    # Deduct stock upon initial approval
    if target == "Approved" and prev != "Approved":
        if stock.available_units < req.required_units:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient blood stock available. Available: {stock.available_units}, Required: {req.required_units}"
            )
        stock.available_units -= req.required_units

    # Revert units only if moving back from Approved to Rejected or Pending
    elif prev == "Approved" and target in ["Pending", "Rejected"]:
        stock.available_units += req.required_units

    req.status = target
    db.commit()
    db.refresh(req)
    return req