import pdfplumber
import logging
import re
import os
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

logger = logging.getLogger(__name__)

def resolve_resume_path(file_path: str) -> str:
    if not file_path:
        return file_path

    if os.path.exists(file_path):
        return file_path

    root_dir = Path(__file__).resolve().parents[2]
    if not os.path.isabs(file_path):
        candidate = root_dir / file_path
        if candidate.exists():
            return str(candidate)

        stripped = file_path.lstrip('./\\')
        candidate = root_dir / stripped
        if candidate.exists():
            return str(candidate)

    upload_dir = root_dir / 'backend' / 'uploads' / 'resumes'
    candidate = upload_dir / os.path.basename(file_path)
    if candidate.exists():
        return str(candidate)

    return file_path


def attempt_text_cleanup(text: str) -> str:
    """Basic cleanup to recover broken text strings while preserving structure"""
    if not text:
        return ""
    # Remove control characters except newlines/tabs
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\xff]', '', text)
    # Normalize spaces within each line, preserve newlines
    lines = [re.sub(r'[ \t]+', ' ', line).strip() for line in text.split('\n')]
    
    # Remove consecutive empty lines (max 1 empty line in a row)
    cleaned_lines = []
    for line in lines:
        if line:
            cleaned_lines.append(line)
        elif not cleaned_lines or cleaned_lines[-1] != "":
            cleaned_lines.append("")
            
    return '\n'.join(cleaned_lines).strip()

def extract_text_from_file(file_path: str) -> str:
    """
    Extracts raw text from a PDF, DOCX, or TXT file.
    """
    file_path = resolve_resume_path(file_path)
    text = ""
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == '.txt':
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
        except Exception as e:
            logger.error(f"TXT extraction failed: {e}")
            
    elif ext == '.docx':
        try:
            # Extract text from docx without third-party dependencies by parsing the zip xml
            with zipfile.ZipFile(file_path) as docx:
                xml_content = docx.read('word/document.xml')
                tree = ET.XML(xml_content)
                NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
                paras = []
                for paragraph in tree.iter(NAMESPACE + 'p'):
                    texts = [node.text for node in paragraph.iter(NAMESPACE + 't') if node.text]
                    if texts:
                        paras.append(''.join(texts))
                text = '\n'.join(paras)
        except Exception as e:
            logger.error(f"DOCX extraction failed: {e}")

    elif ext == '.doc':
        raise ValueError(
            "Legacy .DOC format is not supported. Please open the file in Word and Save As .DOCX or export to PDF."
        )

    else:
        # Default to PDF extraction
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            logger.warning(f"Standard PDF extraction failed: {e}")

        # Fallback: if extraction result is small, try other PDF extraction libraries
        if not text.strip() or len(text.strip()) < 300:
            logger.info("Primary extraction returned small text; attempting alternative extractors...")
            # Try PyMuPDF (fitz)
            try:
                import fitz  # PyMuPDF
                doc = fitz.open(file_path)
                alt_text = []
                for page in doc:
                    alt_text.append(page.get_text())
                alt_text = '\n'.join([t for t in alt_text if t])
                if alt_text.strip() and len(alt_text.strip()) > len(text.strip()):
                    logger.info(f"PyMuPDF extracted {len(alt_text)} characters")
                    text = alt_text
            except Exception as e:
                logger.debug(f"PyMuPDF extraction unavailable or failed: {e}")

            # Try PyPDF2 / pypdf
            if not text.strip() or len(text.strip()) < 300:
                try:
                    from PyPDF2 import PdfReader
                    reader = PdfReader(file_path)
                    pages = []
                    for p in reader.pages:
                        try:
                            pages.append(p.extract_text() or "")
                        except Exception:
                            pages.append("")
                    alt_text2 = '\n'.join([p for p in pages if p])
                    if alt_text2.strip() and len(alt_text2.strip()) > len(text.strip()):
                        logger.info(f"PyPDF2 extracted {len(alt_text2)} characters")
                        text = alt_text2
                except Exception as e:
                    logger.debug(f"PyPDF2 extraction unavailable or failed: {e}")

            # Fallback OCR if still empty (e.g. scanned PDF)
            if not text.strip() or len(text.strip()) < 300:
                logger.info("Attempting OCR fallback extraction...")
                try:
                    from pdf2image import convert_from_path  # pyright: ignore
                    import pytesseract  # pyright: ignore
                    images = convert_from_path(file_path)
                    for img in images:
                        text += pytesseract.image_to_string(img) + "\n"
                except ImportError:
                    logger.warning("OCR libraries (pdf2image, pytesseract) not installed. Skipping OCR.")
                except Exception as e:
                    logger.warning(f"OCR fallback failed: {e}")

    if not text.strip():
        logger.info("Parser returned empty, attempting text cleanup.")
        
    text = attempt_text_cleanup(text)
    return text
