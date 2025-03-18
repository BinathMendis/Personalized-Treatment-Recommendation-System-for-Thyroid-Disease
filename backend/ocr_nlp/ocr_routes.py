from fastapi import APIRouter, File, UploadFile, HTTPException
from extraction.extract_lab_values import extract_lab_values
from typing import Dict
import shutil
import os

router = APIRouter()

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-lab-report/", response_model=Dict[str, float])
def upload_lab_report(file: UploadFile = File(...)):
    """Handles PDF/Image uploads, extracts thyroid lab values."""
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    try:
        # Save file temporarily
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Extract lab values
        extracted_values = extract_lab_values(file_path)
        
        # Delete temporary file
        os.remove(file_path)
        
        if not extracted_values:
            raise HTTPException(status_code=400, detail="No valid thyroid parameters found.")
        
        return extracted_values
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
