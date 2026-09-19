import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from nlp_engine import NlpEngine
from report_extractor import ReportExtractor

def test_pipeline():
    print('--- Starting AR Medical Pipeline Test ---')
    
    extractor = ReportExtractor()
    nlp = NlpEngine()
    
    file_path = 'C:/Users/RAJATH M P/OneDrive/Desktop/heart/nlp-module/test_report.txt'
    print(f'Step 1: Extracting text from {file_path}...')
    text = extractor.extract_text(file_path)
    print(f'Extracted Text: {text}')
    
    print('\nStep 2: Analyzing with NLP Engine...')
    result = nlp.analyze(text)
    
    print('\n--- Analysis Results ---')
    print(f'Primary Organ: {result["primaryOrgan"]}')
    print(f'Primary Condition: {result["primaryCondition"]}')
    print(f'Severity: {result["severity"]}')
    
    print('\nFindings for AR Highlighting:')
    for finding in result['findings']:
        print(f'- {finding["condition"]} -> Organ: {finding["organ"]}, MeshID: {finding["meshId"]}, Region: {finding["regionName"]}')

    
    print('\nSummary:')
    print(result['summary'])
    
    if len(result['findings']) > 1:
        print('\nSUCCESS: Multi-finding support verified!')
    else:
        print('\nINFO: Only one finding detected.')

if __name__ == '__main__':
    test_pipeline()
