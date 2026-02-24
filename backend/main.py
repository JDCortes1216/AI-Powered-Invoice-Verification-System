import fitz
import io
import os
import json
import requests
import pytesseract
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HF_API_KEY = os.getenv("HF_API_KEY")
HF_API_URL = "https://router.huggingface.co/v1/chat/completions"

@app.post("/upload")
async def upload_invoice(file: UploadFile = File(...)):
    contents = await file.read()

    if file.filename.endswith(".pdf"):
        pdf = fitz.open(stream=contents, filetype="pdf")
        page = pdf[0]
        # better quality for OCR
        mat = fitz.Matrix(2.0, 2.0)
        pix = page.get_pixmap(matrix=mat)
        image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    else:
        image = Image.open(io.BytesIO(contents))

    # Perform OCR
    extracted_text = pytesseract.image_to_string(image, config="--psm 6")
    print("=== OCR EXTRACTED TEXT ===")
    print(extracted_text)
    print("==========================")

    if not extracted_text.strip():
        return {"error": "OCR extracted no text from the file. Try a clearer image."}

    # Send to Qwen2.5 via HuggingFace
    response = requests.post(
        HF_API_URL,
        headers={
            "Authorization": f"Bearer {HF_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "Qwen/Qwen2.5-7B-Instruct",
            "messages": [
                {
                    "role": "user",
                    "content": f"""You are an invoice data extractor. Extract data from the invoice text below and return ONLY a valid JSON object with no extra text or markdown.

Rules:
- vendor_name: full name of the vendor
- invoice_number: the invoice number (remove # symbol)
- invoice_date: date in MM//DD/YYYY format
- due_date: due date in MM//DD/YYYY format
- total_amount: total amount as a number string (remove $ symbol and include the decimal point)
- subtotal: subtotal as a number string
- tax: tax amount as a number string
- line_items: array of items with description, quantity, unit_price, total
- discrepancies: list any math errors or inconsistencies found
- verification_status: "verified" if all math checks out, "needs_review" if minor issues, "rejected" if major issues

Invoice text:
{extracted_text}

Return ONLY this JSON:
{{
    "vendor_name": "",
    "invoice_number": "",
    "invoice_date": "",
    "due_date": "",
    "total_amount": "",
    "line_items": [{{"description": "", "quantity": "", "unit_price": "", "total": ""}}],
    "tax": "",
    "subtotal": "",
    "discrepancies": [],
    "verification_status": ""
}}"""
                }
            ],
            "max_tokens": 1024
        }
    )

    try:
        content = response.json()["choices"][0]["message"]["content"]
        print("=== HF API RESPONSE ===")
        print(content)
        print("=======================")
        json_start = content.find("{")
        json_end = content.rfind("}") + 1
        result = json.loads(content[json_start:json_end])
    except Exception as e:
        print("=== ERROR ===")
        print(response.text)
        result = {"raw_response": response.text, "error": str(e)}

    return result