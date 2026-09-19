using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

public class ARPlacementManager : MonoBehaviour
{
    [SerializeField]
    private GameObject heartPrefab;

    private GameObject spawnedHeart;
    private ARRaycastManager raycastManager;
    private ARPlaneManager planeManager;
    private static List<ARRaycastHit> hits = new List<ARRaycastHit>();

    private void Awake()
    {
        raycastManager = FindObjectOfType<ARRaycastManager>();
        planeManager = FindObjectOfType<ARPlaneManager>();
    }

    private void Update()
    {
        // Check for touch input
        if (Input.touchCount > 0)
        {
            Touch touch = Input.GetTouch(0);

            if (touch.phase == TouchPhase.Began)
            {
                // If we already spawned the heart, don't spawn another one
                // Instead, allow the user to interact with the existing one
                if (spawnedHeart != null)
                {
                    return;
                }

                if (raycastManager.Raycast(touch.position, hits, TrackableType.PlaneWithinPolygon))
                {
                    Pose hitPose = hits[0].pose;
                    spawnedHeart = Instantiate(heartPrefab, hitPose.position, hitPose.rotation);

                    // Make the spawned heart face the camera
                    Vector3 lookPos = Camera.main.transform.position - spawnedHeart.transform.position;
                    lookPos.y = 0;
                    spawnedHeart.transform.rotation = Quaternion.LookRotation(lookPos);

                    // Disable plane detection once placed
                    planeManager.enabled = false;
                    foreach (var plane in planeManager.trackables)
                    {
                        plane.gameObject.SetActive(false);
                    }
                    
                    UIManager.Instance.ShowStatus("Heart Model Placed. You can now rotate and zoom.");
                }
            }
        }
    }

    public GameObject GetSpawnedHeart()
    {
        return spawnedHeart;
    }
}
