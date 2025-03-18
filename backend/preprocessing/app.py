from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import pytesseract
from pdf2image import convert_from_path
import re

# 🔹 Set Tesseract OCR Path (IMPORTANT)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# 🔹 Ensure Poppler Path Exists
os.environ["PATH"] += os.pathsep + r"C:/poppler/Library/bin"

app = FastAPI()

# ✅ Add CORS Middleware (Fixes Network Error & Cross-Origin Issues)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# ✅ Define request model for predictions
class PredictionRequest(BaseModel):
    age: int
    gender: str
    weight_kg: float
    height_cm: float
    tsh: float
    t3: float
    t4: float

# ✅ OCR Function to Extract Lab Values (Now Includes Gender, Weight, Height)
def extract_lab_values_from_pdf(pdf_path):
    try:
        images = convert_from_path(pdf_path)
        text = ""

        for image in images:
            text += pytesseract.image_to_string(image)

        print("\n📝 **Extracted OCR Text:**\n", text)  # 🔍 Debugging Step

        # ✅ Extract Lab Values Using Regex
        tsh_match = re.search(r'TSH\s*[:=]?\s*([\d.,]+)', text, re.IGNORECASE)
        t3_match = re.search(r'T3\s*[:=]?\s*([\d.,]+)', text, re.IGNORECASE)
        t4_match = re.search(r'T4\s*[:=]?\s*([\d.,]+)', text, re.IGNORECASE)
        age_match = re.search(r'Age\s*[:=]?\s*(\d+)', text, re.IGNORECASE)
        gender_match = re.search(r'Gender\s*[:=]?\s*(Male|Female|Other)', text, re.IGNORECASE)
        weight_match = re.search(r'Weight\s*[:=]?\s*([\d.,]+)', text, re.IGNORECASE)
        height_match = re.search(r'Height\s*[:=]?\s*([\d.,]+)', text, re.IGNORECASE)

        # ✅ Convert Extracted Values
        tsh = float(tsh_match.group(1).replace(",", ".")) if tsh_match else None
        t3 = float(t3_match.group(1).replace(",", ".")) if t3_match else None
        t4 = float(t4_match.group(1).replace(",", ".")) if t4_match else None
        age = int(age_match.group(1)) if age_match else None
        gender = gender_match.group(1) if gender_match else None
        weight = float(weight_match.group(1).replace(",", ".")) if weight_match else None
        height = float(height_match.group(1).replace(",", ".")) if height_match else None

        # ✅ Debugging: Show Extracted Data
        print(f"Extracted Values: Age={age}, Gender={gender}, Weight={weight}, Height={height}, TSH={tsh}, T3={t3}, T4={t4}")

        return {
            "age": age,
            "gender": gender,
            "weight_kg": weight,
            "height_cm": height,
            "tsh": tsh,
            "t3": t3,
            "t4": t4
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR extraction error: {str(e)}")

# ✅ File Upload & Lab Value Extraction Endpoint
@app.post("/extract_lab_values")
async def extract_lab_values(file: UploadFile = File(...)):
    try:
        os.makedirs("temp", exist_ok=True)  # ✅ Ensure the "temp" directory exists

        file_location = f"temp/{file.filename}"  # ✅ Save file temporarily
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        extracted_values = extract_lab_values_from_pdf(file_location)  # ✅ Extract values from the PDF

        return {
            "message": "✅ File processed successfully!",
            "extracted_values": extracted_values
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"🚨 Error processing file: {str(e)}")

# ✅ Prediction Endpoint
@app.post("/predict")
async def predict_risk(request: PredictionRequest):
    try:
        predicted_risk = "Stable"
        confidence = 95.5
        shap_values = [["TSH", 0.8], ["T3", -0.5], ["Age", 0.3]]  # Sample SHAP values

        return {
            "predicted_risk": predicted_risk,
            "confidence": confidence,
            "shap_values": shap_values
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"🚨 Prediction error: {str(e)}")

# ✅ Run the server using:
# uvicorn app:app --reload
