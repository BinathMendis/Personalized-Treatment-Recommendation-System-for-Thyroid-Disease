import pytesseract
import cv2
import pdf2image
import re
import numpy as np
from PIL import Image

def preprocess_image(image_path):
    """Preprocess image for better OCR accuracy."""
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.threshold(img, 150, 255, cv2.THRESH_BINARY)[1]  # Binarization
    return img

def extract_text_from_image(image_path):
    """Extract text from a given image using OCR."""
    img = preprocess_image(image_path)
    text = pytesseract.image_to_string(img)
    return text

def extract_text_from_pdf(pdf_path):
    """Convert PDF to image and extract text from it."""
    images = pdf2image.convert_from_path(pdf_path)
    extracted_text = ""
    for img in images:
        text = pytesseract.image_to_string(img)
        extracted_text += text + "\n"
    return extracted_text

def extract_medical_values(text):
    """Extract TSH, T3, and T4 values using regex."""
    data = {}
    
    tsh_match = re.search(r"TSH\s*[:=]?\s*(\d+\.?\d*)", text, re.IGNORECASE)
    t3_match = re.search(r"T3\s*[:=]?\s*(\d+\.?\d*)", text, re.IGNORECASE)
    t4_match = re.search(r"T4\s*[:=]?\s*(\d+\.?\d*)", text, re.IGNORECASE)
    
    data['TSH'] = float(tsh_match.group(1)) if tsh_match else None
    data['T3'] = float(t3_match.group(1)) if t3_match else None
    data['T4'] = float(t4_match.group(1)) if t4_match else None
    
    return data

def process_lab_report(file_path, file_type="pdf"):
    """Main function to process lab report and extract medical values."""
    text = extract_text_from_pdf(file_path) if file_type == "pdf" else extract_text_from_image(file_path)
    extracted_data = extract_medical_values(text)
    return extracted_data

# Example Usage
if __name__ == "__main__":
    file_path = "sample_lab_report.pdf"  # Change this to an actual file path
    result = process_lab_report(file_path, file_type="pdf")
    print("Extracted Medical Data:", result)
