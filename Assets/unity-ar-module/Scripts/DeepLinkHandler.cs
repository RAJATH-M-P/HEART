using UnityEngine;
using System.Collections.Generic;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

public class DeepLinkHandler : MonoBehaviour
{
    public RegionHighlighter highlighter;
    public UIManager uiManager;
    public GameObject anatomicalModelPrefab;

    /// <summary>
    /// Parses the incoming deep link URI and triggers the AR visualization.
    /// Example URI: armedviz://ar?organ=heart&regions=mesh_left_ventricle,mesh_aorta&severity=mild&condition=LVH
    /// </summary>
    public void OnDeepLinkReceived(string uri)
    {
        Debug.Log($"Deep Link Received: {uri}");

        // 1. Parse URI Parameters
        string organ = GetParam(uri, "organ");
        string regionsRaw = GetParam(uri, "regions");
        string severity = GetParam(uri, "severity");
        string condition = GetParam(uri, "condition");

        // 2. Split multiple regions into a list
        List<string> regionList = new List<string>();
        if (!string.IsNullOrEmpty(regionsRaw))
        {
            regionList.AddRange(regionsRaw.Split(','));
        }

        // 3. Instantiate the correct organ model based on the 'organ' param
        // (In a full system, this would load from an Addressables group or Resources)
        GameObject modelInstance = Instantiate(anatomicalModelPrefab);
        
        // 4. Highlight the affected regions
        if (highlighter != null)
        {
            highlighter.HighlightRegions(regionList);
        }

        // 5. Update UI Overlays with medical info
        if (uiManager != null)
        {
            uiManager.DisplayMedicalInfo(organ, condition, regionsRaw, severity);
        }
    }

    private string GetParam(string uri, string paramName)
    {
        // Simple URI parameter extraction logic
        string search = paramName + "=";
        int start = uri.IndexOf(search);
        if (start == -1) return "unknown";
        
        start += search.Length;
        int end = uri.IndexOf('&', start);
        if (end == -1) end = uri.Length;
        
        return uri.Substring(start, end - start);
    }
}
