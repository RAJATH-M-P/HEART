using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

public class HeartDataClient : MonoBehaviour
{
    public string apiEndpoint = "http://localhost:5000/api/analyze";
    public RegionHighlighter regionHighlighter;
    public UIManager uiManager;

    [System.Serializable]
    public class AnalysisRequest
    {
        public string text;
        public string fileName;
    }

    [System.Serializable]
    public class RegionInfo
    {
        public string name;
        public string unity_object;
    }

    [System.Serializable]
    public class AnalysisResponse
    {
        public string organ;
        public string condition;
        public string conditionCode;
        public List<RegionInfo> affectedRegions;
        public string severity;
        public string summary;
    }

    public void AnalyzeMedicalReport(string reportText)
    {
        StartCoroutine(PostRequest(reportText));
    }

    private IEnumerator PostRequest(string text)
    {
        AnalysisRequest requestData = new AnalysisRequest { text = text, fileName = "uploaded_report.txt" };
        string json = JsonConvert.SerializeObject(requestData);

        using (UnityWebRequest request = new UnityWebRequest(apiEndpoint, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(json);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                AnalysisResponse response = JsonConvert.DeserializeObject<AnalysisResponse>(request.downloadHandler.text);
                ProcessResult(response);
            }
            else
            {
                Debug.LogError("NLP API Error: " + request.error);
                uiManager.ShowStatus("Error connecting to NLP engine.");
            }
        }
    }

    private void ProcessResult(AnalysisResponse response)
    {
        if (response.organ == "heart")
        {
            List<string> meshIds = new List<string>();
            foreach (var region in response.affectedRegions)
            {
                meshIds.Add(region.unity_object);
            }

            regionHighlighter.HighlightRegions(meshIds);
            uiManager.DisplayMedicalInfo(
                response.condition, 
                response.severity, 
                response.summary
            );
        }
    }
}
