"""
Heart region mapper.
Maps detected conditions to specific heart anatomical regions
with Unity object name references.
"""

from condition_database import CARDIAC_CONDITIONS, SEVERITY_KEYWORDS
import re
import logging

logger = logging.getLogger(__name__)


def map_condition_to_region(condition_name, condition_code=None):
    """
    Given a condition name or code, return the affected heart region info.
    """
    for cond in CARDIAC_CONDITIONS:
        if cond["code"] == condition_code or cond["name"].lower() == condition_name.lower():
            return {
                "name": cond["region"],
                "unity_object": cond["unity_object"],
            }
    return None


def detect_severity(text):
    """
    Detect severity level from the report text.
    Returns: 'mild', 'moderate', 'severe', or 'unknown'
    """
    text_lower = text.lower()

    # Check from most severe to least (in case multiple are mentioned,
    # report the highest severity)
    for level in ["severe", "moderate", "mild"]:
        for keyword in SEVERITY_KEYWORDS[level]:
            if keyword in text_lower:
                return level

    return "unknown"


def find_conditions_by_keywords(text):
    """
    Search for cardiac conditions in text using keyword matching.
    Returns list of matched conditions with confidence scores.
    """
    text_lower = text.lower()
    matches = []

    for cond in CARDIAC_CONDITIONS:
        matched_keywords = []
        for keyword in cond["keywords"]:
            if keyword.lower() in text_lower:
                matched_keywords.append(keyword)

        if matched_keywords:
            # Confidence based on number of matching keywords and specificity
            base_confidence = min(0.95, 0.7 + (len(matched_keywords) - 1) * 0.1)

            matches.append({
                "condition": cond,
                "matched_keywords": matched_keywords,
                "confidence": base_confidence,
            })

    # Sort by confidence (highest first)
    matches.sort(key=lambda x: x["confidence"], reverse=True)

    return matches


def extract_key_findings(text, condition_code=None):
    """
    Extract relevant key findings from the text based on the detected condition.
    """
    findings = []
    text_lower = text.lower()

    # Generic measurement findings
    measurement_patterns = [
        (r'(?:septum|ivs|septal)\s*(?:thickness)?[:\s]*(\d+\.?\d*\s*(?:mm|cm))', "Interventricular septum thickness: {}"),
        (r'(?:posterior wall|lvpw|pw)\s*(?:thickness)?[:\s]*(\d+\.?\d*\s*(?:mm|cm))', "LV posterior wall thickness: {}"),
        (r'(?:ejection fraction|ef|lvef)[:\s]*(\d+\.?\d*\s*%?)', "Ejection fraction: {}"),
        (r'(?:lvidd?|lv\s*dimension)[:\s]*(\d+\.?\d*\s*(?:mm|cm))', "LV internal dimension: {}"),
        (r'(?:left atri(?:um|al))[:\s]*(\d+\.?\d*\s*(?:mm|cm))', "Left atrial size: {}"),
    ]

    for pattern, template in measurement_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            findings.append(template.format(match.group(1).strip()))

    # Look for descriptive findings
    descriptive_patterns = [
        r'(concentric (?:hypertrophy|remodeling))',
        r'(eccentric hypertrophy)',
        r'(wall motion abnormality)',
        r'(regional wall motion)',
        r'(global (?:hypokinesis|dysfunction))',
        r'(calcifi(?:ed|cation))',
        r'(thickened (?:leaflets?|valve))',
        r'(prolapsing (?:leaflet|valve))',
        r'(restricted (?:leaflet|valve) motion)',
    ]

    for pattern in descriptive_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            finding = match.group(1).strip().capitalize()
            if finding not in findings:
                findings.append(finding)

    return findings[:8]  # Limit to 8 key findings
