using UnityEngine;
using System.Collections.Generic;
using System.Linq;

public class RegionHighlighter : MonoBehaviour
{
    [Header("Materials (Assign in Inspector)")]
    public Material highlightMaterial; // Material with emission/glow shader
    public Material baseMaterial;      // Standard realistic tissue material
    public Material transparentMaterial; // Semi-transparent context material

    /// <summary>
    /// Highlights multiple specific parts of the anatomical model.
    /// Expects a list of mesh IDs (e.g., ["mesh_left_ventricle", "mesh_coronary_arteries"])
    /// </summary>
    public void HighlightRegions(List<string> targetObjectNames)
    {
        if (targetObjectNames == null || targetObjectNames.Count == 0) return;

        // Find all child mesh renderers
        MeshRenderer[] renderers = GetComponentsInChildren<MeshRenderer>();

        foreach (MeshRenderer renderer in renderers)
        {
            // Check if this mesh is one of the affected regions
            if (targetObjectNames.Contains(renderer.gameObject.name))
            {
                // Apply highlight material (Glow/Emission)
                renderer.material = highlightMaterial;

                // Add pulsing effect for visual emphasis
                if (renderer.gameObject.GetComponent<PulseEffect>() == null)
                {
                    renderer.gameObject.AddComponent<PulseEffect>();
                }
            }
            else
            {
                // Context regions become semi-transparent to highlight affected areas
                renderer.material = transparentMaterial;

                // Remove pulse effect if it was previously highlighted
                PulseEffect pulse = renderer.gameObject.GetComponent<PulseEffect>();
                if (pulse != null) Destroy(pulse);
            }
        }
    }

    public void ResetMaterials()
    {
        MeshRenderer[] renderers = GetComponentsInChildren<MeshRenderer>();
        foreach (MeshRenderer renderer in renderers)
        {
            renderer.material = baseMaterial;
            PulseEffect pulse = renderer.gameObject.GetComponent<PulseEffect>();
            if (pulse != null) Destroy(pulse);
        }
    }
}
