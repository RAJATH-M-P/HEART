"""
Core NLP engine for medical report analysis.
Uses SciSpaCy for Named Entity Recognition and a custom keyword-based
condition detection pipeline optimized for cardiac reports.
"""

import logging
import re
from text_preprocessor import preprocess_text, expand_abbreviations, extract_sections
from heart_region_mapper import (
    find_conditions_by_keywords as find_conditions,
    detect_severity,
    extract_key_findings,
)
from condition_database import CARDIAC_CONDITIONS

def get_region_details(organ_id, region_id):
    for cond in CARDIAC_CONDITIONS:
        if cond["region"] == region_id:
            return {
                "name": cond["region"],
                "mesh_id": cond["unity_object"]
            }
    return None


logger = logging.getLogger(__name__)

# Try to load SciSpaCy — fall back to keyword-only mode if unavailable
try:
    import spacy
    SPACY_AVAILABLE = True
except ImportError:
    SPACY_AVAILABLE = False
    logger.warning("spaCy not available. Using keyword-only mode.")


class NlpEngine:
    """
    Medical NLP engine combining SciSpaCy NER with keyword-based
    cardiac condition detection.
    """

    def __init__(self):
        self.nlp = None
        self._load_model()

    def _load_model(self):
        """Load the SciSpaCy NER model for disease entity recognition."""
        if not SPACY_AVAILABLE:
            logger.warning("spaCy not installed. Operating in keyword-only mode.")
            return

        # Try to load SciSpaCy biomedical NER model
        model_names = [
            "en_ner_bc5cdr_md",    # Best for disease + chemical NER
            "en_core_sci_sm",       # General biomedical
            "en_core_web_sm",       # Fallback to general English
        ]

        for model_name in model_names:
            try:
                self.nlp = spacy.load(model_name)
                logger.info(f"Loaded NLP model: {model_name}")
                return
            except OSError:
                logger.info(f"Model {model_name} not available, trying next...")

        logger.warning("No spaCy model available. Using keyword-only analysis.")

    def is_model_loaded(self):
        """Check if a spaCy model is loaded."""
        return self.nlp is not None

    def analyze(self, text):
        """
        Analyze medical report text and extract conditions across any organ.
        
        Returns a dict with:
        - detected_organs: List of organs found
        - findings: List of findings { condition, organ, region, severity, ... }
        - summary: overall summary
        """
        # Step 1: Preprocess
        cleaned_text = preprocess_text(text)
        expanded_text = expand_abbreviations(cleaned_text)

        # Step 2: Extract sections
        sections = extract_sections(expanded_text)

        # Step 3: NER-based entity extraction
        ner_entities = []
        if self.nlp:
            ner_entities = self._extract_entities(expanded_text)

        # Step 4: Keyword-based condition detection across all organs
        search_text = expanded_text
        if sections["impression"]:
            search_text = sections["impression"] + " " + expanded_text
        elif sections["conclusion"]:
            search_text = sections["conclusion"] + " " + expanded_text

        keyword_matches = find_conditions(search_text)

        # Step 5: Combine NER + keyword results
        primary_match = self._determine_primary_condition(ner_entities, keyword_matches)

        if not primary_match:
            return self._build_no_condition_response(cleaned_text)

        # Step 6: Build detailed findings list (Multi-Finding Support)
        findings = []
        severity = detect_severity(expanded_text)
        key_findings = extract_key_findings(expanded_text)

        # Process the primary and secondary matches
        for match in keyword_matches[:3]: # Process top 3 findings
            cond_info = match["condition"]
            organ_id = cond_info["region"] # This was wrong, should be mapped via knowledge base
            # Actually, CARDIAC_CONDITIONS objects have 'region' and 'unity_object'
            # Let's use the correct mapping
            region_id = cond_info["region"]
            region_details = get_region_details("heart", region_id)


            findings.append({
                "condition": cond_info["name"],
                "organ": "heart",
                "region": region_id,
                "regionName": region_details["name"] if region_details else region_id,
                "meshId": region_details["mesh_id"] if region_details else "unknown",
                "description": cond_info["description"],
                "severity": severity,
                "confidence": round(match["confidence"], 2)
            })

        # Use the first finding as the primary for the top-level response
        main = findings[0]
        
        # Find the condition code from CARDIAC_CONDITIONS for the primary finding
        condition_code = "UNKNOWN"
        for cond in CARDIAC_CONDITIONS:
            if cond["name"] == main["condition"]:
                condition_code = cond["code"]
                break

        return {
            "organ": main["organ"],
            "condition": main["condition"],
            "conditionCode": condition_code,
            "affectedRegions": [
                {"name": f["regionName"], "unity_object": f["meshId"]} 
                for f in findings
            ],
            "findings": findings,
            "severity": severity,
            "keyFindings": key_findings,
            "summary": self._generate_summary(main, severity, key_findings),
        }

    def _extract_entities(self, text):
        """Extract named entities using SciSpaCy."""
        entities = []
        doc = self.nlp(text)

        for ent in doc.ents:
            label = ent.label_
            # Filter for disease-related entities
            if label in ["DISEASE", "DISORDER", "CONDITION", "ENTITY"]:
                entities.append({
                    "text": ent.text,
                    "label": label,
                    "start": ent.start_char,
                    "end": ent.end_char,
                })

        return entities

    def _determine_primary_condition(self, ner_entities, keyword_matches):
        """
        Determine the primary condition from NER entities and keyword matches.
        NER entities boost confidence of keyword matches.
        """
        if not keyword_matches:
            return None

        # Boost confidence if NER also detected the condition
        if ner_entities:
            ner_texts = [ent["text"].lower() for ent in ner_entities]
            for match in keyword_matches:
                for keyword in match["matched_keywords"]:
                    if any(keyword.lower() in ner_text for ner_text in ner_texts):
                        match["confidence"] = min(0.98, match["confidence"] + 0.1)
                        break

        # Re-sort after boosting
        keyword_matches.sort(key=lambda x: x["confidence"], reverse=True)

        return keyword_matches[0]

    def _generate_summary(self, main_finding, severity, key_findings):
        """Generate a human-readable summary of the analysis."""
        severity_text = f"{severity} " if severity != "unknown" else ""
        summary = (
            f"The report indicates {severity_text}{main_finding['condition']}. "
            f"{main_finding['description']}. "
            f"The affected region is the {main_finding['regionName']}."
        )

        if key_findings:
            summary += " Key measurements: " + "; ".join(key_findings[:3]) + "."

        return summary

    def _build_no_condition_response(self, text):
        """Build response when no cardiac condition is detected."""
        return {
            "organ": "heart",
            "condition": "No cardiac condition detected",
            "conditionCode": "NORMAL",
            "affectedRegions": [],
            "severity": "none",
            "summary": "No significant cardiac conditions were detected in this report. "
                       "The report may describe normal findings or conditions not currently "
                       "in our knowledge base.",
            "keyFindings": [],
        }
