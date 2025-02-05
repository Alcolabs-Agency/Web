from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
from pdf2image import convert_from_bytes
import cv2
import pytesseract
import torch
import traceback
from pathlib import Path


# Configuración Base
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = Path('/home/yesenia/Escritorio/react/Alcolab/Web/backend/backup-backend-ocr.git/yolov5/runs/train/exp_retrain/weights/best.pt')


# Verificar si el modelo existe
if not MODEL_PATH.exists():
    raise FileNotFoundError(f"El archivo del modelo no se encontró en la ruta: {MODEL_PATH}")

# Inicializar la aplicación Flask
app = Flask(__name__)
CORS(app)

# Verificar OpenCV
print(f"Versión de OpenCV: {cv2.__version__}")

# Cargar modelo YOLOv5
try:
    print(f"Cargando modelo desde: {MODEL_PATH}")
    model = torch.hub.load(str(BASE_DIR / 'yolov5'), 'custom', path=str(MODEL_PATH), source='local', force_reload=True)
    

except Exception as e:
    print(f"Error cargando el modelo YOLOv5: {e}")
    exit(1)


def allowed_file(filename):
    allowed_extensions = {'png', 'jpg', 'jpeg', 'tiff', 'bmp', 'pdf'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions




def preprocess_image(image):
    """Preprocesa la imagen para mejorar la detección del OCR"""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convertir a escala de grises
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)  # Reducir ruido con desenfoque
    thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                   cv2.THRESH_BINARY, 11, 2)  # Binarización adaptativa
    return thresh



def detect_sections(image):
    results = model(image)
    detections = results.pandas().xyxy[0]
    return detections


@app.route('/process-document', methods=['POST'])
def process_document():
    if 'file' not in request.files:
        return jsonify({'error': 'No se envió ningún archivo'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'El nombre del archivo está vacío'}), 400

    if file and allowed_file(file.filename):
        try:
            image = Image.open(file.stream).convert('RGB')
            image = np.array(image)
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            detections = detect_sections(image)
            return jsonify({'detections': detections.to_dict()}), 200

        except Exception as e:
            traceback.print_exc()
            return jsonify({'error': f'Error procesando el archivo: {e}'}), 500
    else:
        return jsonify({'error': 'Tipo de archivo no soportado'}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
