using UnityEngine;
using System.Collections.Generic;

public class ModelAutoMapper : MonoBehaviour
{
    [Header("Mapping Configuration")]
    public List<MeshMapping> mappings = new List<MeshMapping>();

    [System.Serializable]
    public class MeshMapping
    {
        public string modelPartName; // The name in the FBX file
        public string systemId;      // The ID in condition_database.py (e.g., heart_left_ventricle)
    }

    public void AutoMapModel()
    {
        foreach (var mapping in mappings)
        {
            Transform part = FindDeepChild(transform, mapping.modelPartName);
            if (part != null)
            {
                part.name = mapping.systemId;
                Debug.Log($"Mapped {mapping.modelPartName} -> {mapping.systemId}");
            }
            else
            {
                Debug.LogWarning($"Could not find part {mapping.modelPartName} in the model!");
            }
        }
    }

    private Transform FindDeepChild(Transform parent, string name)
    {
        foreach (Transform child in parent)
        {
            if (child.name == name) return child;
            Transform result = FindDeepChild(child, name);
            if (result != null) return result;
        }
        return null;
    }
}
