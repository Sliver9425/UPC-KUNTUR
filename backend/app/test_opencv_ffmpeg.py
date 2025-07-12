import cv2

print("OpenCV version:", cv2.__version__)

# Mostrar información de compilación para ver si FFMPEG está habilitado
build_info = cv2.getBuildInformation()
print("\n--- Video I/O Build Information ---")
for line in build_info.splitlines():
    if "Video I/O:" in line or "FFMPEG:" in line:
        print(line)

# Prueba de apertura de stream MJPEG HTTP con FFMPEG
url = "http://192.168.100.4:4747/video"  # Cambia por la URL de tu cámara si es necesario
cap = cv2.VideoCapture(url, cv2.CAP_FFMPEG)

if not cap.isOpened():
    print("\nNO soporta MJPEG HTTP con FFMPEG o la cámara no está disponible.")
else:
    print("\n¡Soporta MJPEG HTTP con FFMPEG!")
    ret, frame = cap.read()
    print("Frame leído:", ret)
    if ret:
        print("Dimensiones del frame:", frame.shape)
    cap.release() 