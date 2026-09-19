Shader "Custom/HighlightGlow"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _Color ("Main Color", Color) = (1,1,1,1)
        [HDR] _EmissionColor ("Emission Color", Color) = (1,0,0,1)
        _FresnelPower ("Fresnel Power", Range(0.1, 10)) = 3.0
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" "Queue"="Geometry" }
        LOD 200

        CGPROGRAM
        #pragma surface surf Standard fullforwardshadows

        sampler2D _MainTex;
        fixed4 _Color;
        fixed4 _EmissionColor;
        float _FresnelPower;

        struct Input
        {
            float2 uv_MainTex;
            float3 viewDir;
            float3 worldNormal;
        };

        void surf (Input IN, inout SurfaceOutputStandard o)
        {
            fixed4 c = tex2D (_MainTex, IN.uv_MainTex) * _Color;
            o.Albedo = c.rgb;
            
            // Calculate Fresnel
            float fresnel = dot(IN.worldNormal, IN.viewDir);
            fresnel = saturate(1 - fresnel);
            fresnel = pow(fresnel, _FresnelPower);
            
            // Combine Emission and Fresnel
            o.Emission = _EmissionColor.rgb + (_EmissionColor.rgb * fresnel);
            
            o.Alpha = c.a;
        }
        ENDCG
    }
    FallBack "Diffuse"
}
