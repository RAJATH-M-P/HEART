using UnityEngine;

public class PulseEffect : MonoBehaviour
{
    private Material mat;
    private float speed = 2.0f;
    private float minIntensity = 0.5f;
    private float maxIntensity = 1.5f;

    void Start()
    {
        MeshRenderer renderer = GetComponent<MeshRenderer>();
        if (renderer != null)
        {
            // Create a material instance so we don't modify the shared asset
            mat = renderer.material;
        }
    }

    void Update()
    {
        if (mat != null)
        {
            // Calculate a sine wave between min and max intensity
            float emission = minIntensity + Mathf.PingPong(Time.time * speed, maxIntensity - minIntensity);
            
            // Assume the shader uses "_EmissionColor" property
            Color baseColor = Color.red; // The glow color
            Color finalColor = baseColor * Mathf.LinearToGammaSpace(emission);
            
            mat.SetColor("_EmissionColor", finalColor);
        }
    }
}
