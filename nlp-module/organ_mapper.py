import json
import re
import logging
import os

logger = logging.getLogger(__name__)

# Load knowledge base
KNOWLEDGE_PATH = os.path.join(os.path.dirname(__file__), 'medical_knowledge.json')

def load_knowledge():
    with open(KNOWLEDGE_PATH, 'r') as f:
        return json.load(f)

def detect_severity(text):
    """
    Detect severity level from report text.
    Returns: 'mild', 'moderate', 'severe', or 'unknown'
    """
    severity_map = {
        "severe": ["severe", "critical", "advanced", "marked"],
        "moderate": ["moderate", "significant", "intermediate"],
        "mild": ["mild", "slight", "minimal", "early"]
    }
    text_lower = text.lower()
    for level, keywords in severity_map.items():
        if any(k in text_lower for k in keywords):
            return level
    return "unknown"

def find_conditions(text):
    """
    Search for medical conditions across any organ using the universal knowledge base.
    Returns list of matched conditions with confidence scores.
    """
    knowledge = load_knowledge()
    text_lower = text.lower()
    matches = []

    for cond_id, cond_info in knowledge["conditions"].items():
        matched_keywords = []
        for keyword in cond_info["keywords"]:
            if keyword.lower() in text_lower:
                matched_keywords.append(keyword)

        if matched_keywords:
            # Confidence based on number of matches and keyword length (specificity)
            base_confidence = min(0.95, 0.7 + (len(matched_keywords) - 1) * 0.1)
            
            matches.append({
                "id": cond_id,
                "info": cond_info,
                "matched_keywords": matched_keywords,
                "confidence": base_confidence,
            })

    matches.sort(key=lambda x: x["confidence"], reverse=True)
    return matches

def get_region_details(organ_id, region_id):
    """Retrieve mesh ID and function for a specific organ region."""
    knowledge = load_knowledge()
    organ = knowledge["organs"].get(organ_id)
    if organ:
        region = organ["regions"].get(region_id)
        if region:
            return region
    return None

def extract_key_findings(text):
    """Extract medical measurements and descriptions using regex."""
    findings = []
    
    # Universal measurement patterns (value + unit)
    measurement_patterns = [
        (r'(\d+\.?\d*\s*(?:mm|cm|g/dL|%))', "Measurement: {}"),
    ]
    
    # Specific heart patterns kept for legacy support but generalized
    cardiac_patterns = [
        (r'(?:septum|ivs|septal)\s*(?:thickness)?[:\s]*(\d+\.?\d*\s*(?:mm|cm))', "Septum thickness: {}"),
        (r'(?:ejection fraction|ef|lvef)[:\s]*(\d+\.?\d*\s*%?)', "EF: {}"),
    ]

    # Extract measurements
    for pattern, template in cardiac_patterns + measurement_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            findings.append(template.format(match.group(1).strip()))

    # Extract descriptive findings
    descriptive_patterns = [
        r'(hypertrophy|stenosis|regurgitation|insufficiency|narrowing|calcification)',
        r'(hypokinesis|dysfunction|abnormality)',
    ]

    for pattern in descriptive_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            finding = match.group(1).strip().capitalize()
            if finding not in findings:
                findings.append(finding)

    return findings[:10]
