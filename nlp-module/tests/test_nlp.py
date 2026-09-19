"""
Tests for the NLP module.
Tests condition detection, region mapping, severity detection, and key findings extraction.
"""

import sys
import os
import pytest

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from nlp_engine import NlpEngine
from heart_region_mapper import (
    find_conditions_by_keywords,
    detect_severity,
    map_condition_to_region,
    extract_key_findings,
)
from text_preprocessor import preprocess_text, expand_abbreviations, extract_sections


# ============================================================
# NLP Engine Tests
# ============================================================

class TestNlpEngine:
    """Test the full NLP analysis pipeline."""

    @pytest.fixture(autouse=True)
    def setup(self):
        self.engine = NlpEngine()

    def _load_test_file(self, filename):
        test_data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'test_data')
        with open(os.path.join(test_data_dir, filename), 'r') as f:
            return f.read()

    def test_lvh_detection(self):
        """Test detection of left ventricular hypertrophy."""
        text = self._load_test_file('sample_lvh_report.txt')
        result = self.engine.analyze(text)

        assert result['organ'] == 'heart'
        assert 'hypertrophy' in result['condition'].lower() or 'LVH' in result['conditionCode']
        assert len(result['affectedRegions']) > 0
        assert result['affectedRegions'][0]['unity_object'] == 'heart_left_ventricle'
        assert result['severity'] in ['mild', 'moderate', 'severe']

    def test_mvp_detection(self):
        """Test detection of mitral valve prolapse."""
        text = self._load_test_file('sample_mvp_report.txt')
        result = self.engine.analyze(text)

        assert result['organ'] == 'heart'
        assert 'mitral' in result['condition'].lower()
        assert len(result['affectedRegions']) > 0
        assert result['affectedRegions'][0]['unity_object'] == 'heart_mitral_valve'

    def test_cad_detection(self):
        """Test detection of coronary artery disease."""
        text = self._load_test_file('sample_cad_report.txt')
        result = self.engine.analyze(text)

        assert result['organ'] == 'heart'
        assert 'coronary' in result['condition'].lower() or result['conditionCode'] == 'CAD'
        assert len(result['affectedRegions']) > 0

    def test_normal_report(self):
        """Test that normal reports return no condition."""
        text = self._load_test_file('sample_normal_report.txt')
        result = self.engine.analyze(text)

        assert result['organ'] == 'heart'
        assert result['conditionCode'] == 'NORMAL' or 'no' in result['condition'].lower()
        assert len(result['affectedRegions']) == 0

    def test_inline_lvh_text(self):
        """Test LVH detection with inline text."""
        text = "The patient presents with moderate left ventricular hypertrophy. Septum: 14mm."
        result = self.engine.analyze(text)

        assert result['organ'] == 'heart'
        assert 'left ventricular hypertrophy' in result['condition'].lower()
        assert result['conditionCode'] == 'LVH'

    def test_abbreviation_detection(self):
        """Test that abbreviations like LVH are detected."""
        text = "ECG findings are consistent with LVH. The patient has mild concentric hypertrophy."
        result = self.engine.analyze(text)

        assert result['organ'] == 'heart'
        assert 'hypertrophy' in result['condition'].lower()


# ============================================================
# Heart Region Mapper Tests
# ============================================================

class TestHeartRegionMapper:

    def test_find_lvh(self):
        text = "Patient has left ventricular hypertrophy with concentric remodeling."
        matches = find_conditions_by_keywords(text)
        assert len(matches) > 0
        assert matches[0]['condition']['code'] == 'LVH'

    def test_find_mitral_stenosis(self):
        text = "Severe mitral stenosis with valve area of 1.0 cm2."
        matches = find_conditions_by_keywords(text)
        assert len(matches) > 0
        assert matches[0]['condition']['code'] == 'MS'
        assert matches[0]['condition']['unity_object'] == 'heart_mitral_valve'

    def test_find_aortic_stenosis(self):
        text = "Calcific aortic stenosis with peak gradient of 60 mmHg."
        matches = find_conditions_by_keywords(text)
        assert len(matches) > 0
        assert matches[0]['condition']['code'] == 'AS'

    def test_find_afib(self):
        text = "The patient is in atrial fibrillation with rapid ventricular response."
        matches = find_conditions_by_keywords(text)
        assert len(matches) > 0
        assert matches[0]['condition']['code'] == 'AFib'
        assert matches[0]['condition']['unity_object'] == 'heart_left_atrium'

    def test_find_vsd(self):
        text = "Echocardiography reveals a small ventricular septal defect."
        matches = find_conditions_by_keywords(text)
        assert len(matches) > 0
        assert matches[0]['condition']['code'] == 'VSD'
        assert matches[0]['condition']['unity_object'] == 'heart_septum'

    def test_severity_detection_mild(self):
        assert detect_severity("Mild left ventricular hypertrophy.") == "mild"

    def test_severity_detection_moderate(self):
        assert detect_severity("Moderate mitral regurgitation noted.") == "moderate"

    def test_severity_detection_severe(self):
        assert detect_severity("Severe aortic stenosis present.") == "severe"

    def test_severity_detection_unknown(self):
        assert detect_severity("Left ventricular hypertrophy present.") == "unknown"

    def test_map_condition_lvh(self):
        result = map_condition_to_region("Left Ventricular Hypertrophy", "LVH")
        assert result is not None
        assert result['name'] == 'Left Ventricle'
        assert result['unity_object'] == 'heart_left_ventricle'

    def test_key_findings_extraction(self):
        text = "Septum thickness: 14 mm. LVEF: 55%. Posterior wall: 13 mm."
        findings = extract_key_findings(text)
        assert len(findings) >= 2


# ============================================================
# Text Preprocessor Tests
# ============================================================

class TestTextPreprocessor:

    def test_preprocess_whitespace(self):
        text = "  Multiple   spaces\n\nand\n  newlines  "
        result = preprocess_text(text)
        assert "  " not in result
        assert result == "Multiple spaces and newlines"

    def test_preprocess_empty(self):
        assert preprocess_text("") == ""
        assert preprocess_text(None) == ""

    def test_expand_abbreviations(self):
        text = "Patient has LVH and mild MR."
        result = expand_abbreviations(text)
        assert "left ventricular hypertrophy" in result.lower()
        assert "mitral regurgitation" in result.lower()

    def test_extract_sections_impression(self):
        text = """
        FINDINGS: Normal LV size and function. LVEF 60%.
        IMPRESSION: Normal echocardiogram. No significant disease.
        """
        sections = extract_sections(text)
        assert sections['findings'] != ""
        assert sections['impression'] != ""


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
