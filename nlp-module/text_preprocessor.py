"""
Text preprocessing utilities for medical reports.
Handles cleaning, abbreviation expansion, and text normalization.
"""

import re


# Common medical abbreviations used in cardiac reports
ABBREVIATIONS = {
    "LVH": "left ventricular hypertrophy",
    "RVH": "right ventricular hypertrophy",
    "LV": "left ventricle",
    "RV": "right ventricle",
    "LA": "left atrium",
    "RA": "right atrium",
    "MV": "mitral valve",
    "AV": "aortic valve",
    "TV": "tricuspid valve",
    "PV": "pulmonary valve",
    "MVP": "mitral valve prolapse",
    "MR": "mitral regurgitation",
    "MS": "mitral stenosis",
    "AS": "aortic stenosis",
    "AR": "aortic regurgitation",
    "TR": "tricuspid regurgitation",
    "PS": "pulmonary stenosis",
    "MI": "myocardial infarction",
    "CAD": "coronary artery disease",
    "CHD": "coronary heart disease",
    "IHD": "ischemic heart disease",
    "VSD": "ventricular septal defect",
    "ASD": "atrial septal defect",
    "AFib": "atrial fibrillation",
    "AF": "atrial fibrillation",
    "STEMI": "ST elevation myocardial infarction",
    "NSTEMI": "non-ST elevation myocardial infarction",
    "ACS": "acute coronary syndrome",
    "EF": "ejection fraction",
    "LVEF": "left ventricular ejection fraction",
    "DCM": "dilated cardiomyopathy",
    "HCM": "hypertrophic cardiomyopathy",
    "HOCM": "hypertrophic obstructive cardiomyopathy",
    "LAE": "left atrial enlargement",
    "RAE": "right atrial enlargement",
    "IVS": "interventricular septum",
    "LVPW": "left ventricular posterior wall",
    "LVID": "left ventricular internal dimension",
    "LVIDD": "left ventricular internal dimension in diastole",
    "LVIDS": "left ventricular internal dimension in systole",
    "ECG": "electrocardiogram",
    "EKG": "electrocardiogram",
    "Echo": "echocardiography",
}


def preprocess_text(text):
    """
    Clean and preprocess medical report text.
    
    Steps:
    1. Normalize whitespace
    2. Expand abbreviations
    3. Lowercase for matching
    """
    if not text:
        return ""

    # Normalize whitespace and line breaks
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()

    return text


def expand_abbreviations(text):
    """
    Expand common medical abbreviations in the text.
    Only expands when abbreviation appears as a standalone word.
    """
    expanded = text
    for abbr, full_form in ABBREVIATIONS.items():
        # Match abbreviation as a whole word (case-insensitive)
        pattern = r'\b' + re.escape(abbr) + r'\b'
        expanded = re.sub(pattern, f"{abbr} ({full_form})", expanded, flags=re.IGNORECASE)

    return expanded


def extract_sections(text):
    """
    Attempt to extract key sections from a medical report.
    Returns a dict with section names and content.
    """
    sections = {
        "findings": "",
        "impression": "",
        "conclusion": "",
        "diagnosis": "",
        "full_text": text,
    }

    section_patterns = {
        "findings": r'(?:FINDINGS|RESULTS|OBSERVATIONS)[:\s]*(.+?)(?=(?:IMPRESSION|CONCLUSION|DIAGNOSIS|$))',
        "impression": r'(?:IMPRESSION|SUMMARY)[:\s]*(.+?)(?=(?:CONCLUSION|DIAGNOSIS|RECOMMENDATION|$))',
        "conclusion": r'(?:CONCLUSION|CONCLUSIONS)[:\s]*(.+?)(?=(?:RECOMMENDATION|SIGNATURE|$))',
        "diagnosis": r'(?:DIAGNOSIS|DIAGNOSES|ASSESSMENT)[:\s]*(.+?)(?=(?:PLAN|RECOMMENDATION|SIGNATURE|$))',
    }

    for section_name, pattern in section_patterns.items():
        match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        if match:
            sections[section_name] = match.group(1).strip()

    return sections


def extract_numeric_values(text):
    """
    Extract numeric measurements from the text (e.g., wall thickness, EF%).
    """
    measurements = []

    # Pattern: value + unit
    patterns = [
        (r'(?:septum|ivs|septal)\s*(?:thickness)?[:\s]*(\d+\.?\d*)\s*(?:mm|cm)', 'septum_thickness'),
        (r'(?:posterior wall|lvpw|pw)\s*(?:thickness)?[:\s]*(\d+\.?\d*)\s*(?:mm|cm)', 'posterior_wall'),
        (r'(?:ejection fraction|ef|lvef)[:\s]*(\d+\.?\d*)\s*%?', 'ejection_fraction'),
        (r'(?:lvidd?|lv\s*(?:internal\s*)?dimension)[:\s]*(\d+\.?\d*)\s*(?:mm|cm)', 'lv_dimension'),
        (r'(?:left atri(?:um|al)\s*(?:size|dimension)?)[:\s]*(\d+\.?\d*)\s*(?:mm|cm)', 'la_size'),
    ]

    for pattern, name in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            measurements.append({
                'name': name,
                'value': float(match.group(1)),
            })

    return measurements
