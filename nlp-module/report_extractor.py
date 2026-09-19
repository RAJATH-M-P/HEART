import logging
import pytesseract
import pdfplumber
from PIL import Image
import os

logger = logging.getLogger(__name__)

class ReportExtractor:
    """
    Handles extraction of text from various medical report formats.
    Supports: .txt, .pdf, .png, .jpg, .jpeg
    """
    
    def __init__(self, tesseract_cmd=None):
        # Allow overriding tesseract path for different environments
        if tesseract_cmd:
            pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

    def extract_text(self, file_path):
        """
        Determine file type and extract text using appropriate method.
        """
        ext = os.path.splitext(file_path)[1].lower()
        
        try:
            if ext == '.txt':
                return self._extract_from_txt(file_path)
            elif ext == '.pdf':
                return self._extract_from_pdf(file_path)
            elif ext in ['.png', '.jpg', '.jpeg']:
                return self._extract_from_image(file_path)
            else:
                logger.error(f"Unsupported file extension: {ext}")
                return ""
        except Exception as e:
            logger.error(f"Error extracting text from {file_path}: {str(e)}")
            return ""

    def _extract_from_txt(self, file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()

    def _extract_from_pdf(self, file_path):
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        # If PDF is purely image-based (OCR needed)
        if not text.strip():
            logger.info("PDF appears to be image-based. Attempting OCR...")
            # In a full implementation, we would convert PDF pages to images here
            # For now, we return empty and let the system know OCR was needed
            return ""
            
        return text

    def _extract_from_image(self, file_path):
        image = Image.open(file_path)
        return pytesseract.image_to_string(image)
