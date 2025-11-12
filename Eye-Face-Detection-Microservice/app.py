from flask import Flask
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
import base64
import os


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

# Load Haar cascade classifiers
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

def decode_base64_image(base64_string):
    img_data = base64_string.split(',')[1]  # Remove the "data:image..." part
    img_bytes = base64.b64decode(img_data)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

def analyze_focus(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    face_detected = len(faces) > 0
    face_count = len(faces)
    focused = False

    if face_count == 1:
        (x, y, w, h) = faces[0]
        roi_gray = gray[y:y + h, x:x + w]
        eyes = eye_cascade.detectMultiScale(roi_gray)

        # Consider focused if 2 eyes are detected
        if len(eyes) >= 2:
            focused = True

    result = {
        'face_detected': face_detected,
        'face_count': face_count,
        'focused': focused
    }
    return result

@socketio.on('frame')
def handle_frame(data):
    image_data = data.get('image')
    if not image_data:
        return
    
    frame = decode_base64_image(image_data)
    result = analyze_focus(frame)
    emit('analysis', result)


if __name__ == '__main__':
    # socketio.run(app, host='0.0.0.0', port=5000)
    port = int(os.environ.get("PORT", 5000))
    socketio.run(app, host='0.0.0.0', port=port, debug=False)

