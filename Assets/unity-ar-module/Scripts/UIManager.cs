using UnityEngine;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    public static UIManager Instance;

    [Header("UI References")]
    public Text conditionTitleText;
    public Text statusMessageText;
    public GameObject infoPanel;

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
    }

    private void Start()
    {
        ShowStatus("Point your camera at a flat surface to place the Heart model.");
        if (conditionTitleText != null) conditionTitleText.text = "Waiting for analysis data...";
    }

    public void ShowStatus(string message)
    {
        if (statusMessageText != null)
        {
            statusMessageText.text = message;
        }
    }

    public void UpdateConditionText(string conditionCode)
    {
        if (conditionTitleText != null)
        {
            // Map code to human readable name if needed, or just display it
            if (string.IsNullOrEmpty(conditionCode) || conditionCode == "NORMAL")
            {
                conditionTitleText.text = "Normal Heart Anatomy";
                conditionTitleText.color = Color.green;
            }
            else
            {
                conditionTitleText.text = "Condition: " + conditionCode;
                conditionTitleText.color = new Color(1f, 0.4f, 0.4f); // Red/Rose
            }
        }
    }

    public void DisplayMedicalInfo(string organ, string condition, string regions, string severity)
    {
        string formattedInfo = $"Organ: {organ} | Condition: {condition} | Regions: {regions} | Severity: {severity}";
        ShowStatus(formattedInfo);
    }
}
