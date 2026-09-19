
from nlp_engine import NlpEngine
import json

def test_nlp():
    engine = NlpEngine()
    test_cases = [
        {
            "name": "Mitral Valve Regurgitation",
            "text": "The patient presents with moderate mitral valve regurgitation. Ejection fraction is 55%. Left atrium is slightly enlarged."
        },
        {
            "name": "Myocardial Infarction",
            "text": "Acute myocardial infarction detected in the anterior wall. ST-segment elevation seen in leads V1-V4."
        },
        {
            "name": "Normal Report",
            "text": "The heart is normal in size and shape. All valves are functioning normally. No pericardial effusion."
        }
    ]

    for case in test_cases:
        print(f"--- Testing: {case['name']} ---")
        result = engine.analyze(case['text'])
        print(json.dumps(result, indent=2))
        print("\n")

if __name__ == "__main__":
    test_nlp()
