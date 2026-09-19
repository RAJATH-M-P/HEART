using UnityEngine;
using UnityEngine.UI;
using System.IO;
using System.Collections;
using UnityEngine.Networking;

public class ReportUploadManager : MonoBehaviour
{
    [Header("UI References")]
    public InputField reportTextInput; // For direct text input
    public Button uploadButton;
    public Text statusText;

    [Header("Integration")]
    public HeartDataClient dataClient;

    private void Start()
    {
        if (uploadButton != null)
        {
            uploadButton.onClick.AddListener(OnUploadClicked);
        }
    }

    public void OnUploadClicked()
    {
        if (reportTextInput == null || string.IsNullOrEmpty(reportTextInput.text))
        {
            UpdateStatus("Please enter report text first!");
            return;
        }

        string textToAnalyze = reportTextInput.text;
        UpdateStatus("Analyzing report... Please wait.");
        
        // Trigger the analysis via the HeartDataClient
        if (dataClient != null)
        {
            dataClient.AnalyzeMedicalReport(textToAnalyze);
        }
        else
        {
            UpdateStatus("Error: HeartDataClient not assigned!");
        }
    }

    private void UpdateStatus(string message)
    {
        if (statusText != null)
        {
            statusText.text = message;
        }
        Debug.Log($"[UploadManager] {message}");
    }

    // Method to simulate file upload from a local path (for laptop demo)
    public void LoadReportFromFile(string filePath)
    {
        if (File.Exists(filePath))
        {
            string content = File.ReadAllText(filePath);
            if (reportTextInput != null) reportTextInput.text = content;
            OnUploadClicked();
        }
        else
        {
            UpdateStatus("File not found at path!");
        }
    }
}
