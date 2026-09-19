using UnityEngine;

public class HeartModelController : MonoBehaviour
{
    private float rotationSpeed = 0.5f;
    private float pinchZoomSpeed = 0.005f;
    
    private Vector3 minScale = new Vector3(0.1f, 0.1f, 0.1f);
    private Vector3 maxScale = new Vector3(3f, 3f, 3f);

    void Update()
    {
        if (Input.touchCount == 1)
        {
            // One finger touch -> Rotate
            Touch touch = Input.GetTouch(0);

            if (touch.phase == TouchPhase.Moved)
            {
                float rotationX = touch.deltaPosition.x * rotationSpeed;
                float rotationY = touch.deltaPosition.y * rotationSpeed;

                // Rotate around the world up axis (Y) for horizontal drag
                transform.Rotate(Vector3.up, -rotationX, Space.World);
                
                // Rotate around the local right axis (X) for vertical drag
                transform.Rotate(Camera.main.transform.right, rotationY, Space.World);
            }
        }
        else if (Input.touchCount == 2)
        {
            // Two finger touch -> Zoom (Scale)
            Touch touchZero = Input.GetTouch(0);
            Touch touchOne = Input.GetTouch(1);

            Vector2 touchZeroPrevPos = touchZero.position - touchZero.deltaPosition;
            Vector2 touchOnePrevPos = touchOne.position - touchOne.deltaPosition;

            float prevTouchDeltaMag = (touchZeroPrevPos - touchOnePrevPos).magnitude;
            float touchDeltaMag = (touchZero.position - touchOne.position).magnitude;

            float deltaMagnitudeDiff = prevTouchDeltaMag - touchDeltaMag;

            Vector3 newScale = transform.localScale - new Vector3(1, 1, 1) * deltaMagnitudeDiff * pinchZoomSpeed;

            // Clamp scale
            newScale.x = Mathf.Clamp(newScale.x, minScale.x, maxScale.x);
            newScale.y = Mathf.Clamp(newScale.y, minScale.y, maxScale.y);
            newScale.z = Mathf.Clamp(newScale.z, minScale.z, maxScale.z);

            transform.localScale = newScale;
        }
    }
}
