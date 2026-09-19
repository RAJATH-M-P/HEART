"""
AR Medical Visualization — NLP Module
Flask microservice for medical report analysis.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from nlp_engine import NlpEngine
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize NLP engine (loads models on startup)
nlp_engine = NlpEngine()


@app.route('/api/analyze', methods=['POST'])
def analyze_report():
    """
    Analyze a medical report text and extract cardiac conditions.
    
    Expects JSON:
    {
        "text": "...",
        "fileName": "report.pdf"
    }
    
    Returns JSON with organ, condition, affected regions, severity, etc.
    """
    try:
        data = request.get_json()

        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400

        text = data['text']
        file_name = data.get('fileName', 'unknown')

        logger.info(f"Analyzing report: {file_name} ({len(text)} chars)")

        result = nlp_engine.analyze(text)

        logger.info(f"Analysis complete: {result.get('condition', 'No condition found')}")

        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Error analyzing report: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'UP',
        'service': 'AR Medical NLP Module',
        'model_loaded': nlp_engine.is_model_loaded()
    }), 200


@app.route('/api/conditions', methods=['GET'])
def list_conditions():
    """List all supported cardiac conditions and their region mappings."""
    from condition_database import CARDIAC_CONDITIONS
    return jsonify({
        'organ': 'heart',
        'conditions': [
            {
                'name': cond['name'],
                'code': cond['code'],
                'region': cond['region'],
                'unity_object': cond['unity_object']
            }
            for cond in CARDIAC_CONDITIONS
        ]
    }), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
