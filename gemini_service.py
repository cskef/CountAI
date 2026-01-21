"""
Service pour analyser les images avec MediaPipe (Google).
"""

import mediapipe as mp
import numpy as np
import cv2
import base64


# model_selection=1 est optimisé pour les personnes éloignées (0 pour les selfies proches)
# min_detection_confidence=0.5 est le seuil de certitude
mp_face_detection = mp.solutions.face_detection
face_detection = mp_face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.5)

def count_people_in_image(base64_data: str, mime_type: str) -> dict:
    try:
        # 1. Décoder l'image Base64
        image_bytes = base64.b64decode(base64_data)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if image is None:
            raise ValueError("Impossible de décoder l'image.")

        # 2. Conversion BGR (OpenCV) vers RGB (MediaPipe)
        # MediaPipe a besoin d'images RGB pour bien fonctionner
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # 3. Inférence (Détection)
        results = face_detection.process(image_rgb)

        # 4. Comptage
        count = 0
        confidence_scores = []

        if results.detections:
            count = len(results.detections)
            for detection in results.detections:
                confidence_scores.append(detection.score[0])

        # Calcul de la confiance moyenne
        avg_conf = (sum(confidence_scores) / count) if count > 0 else 0
        
        # Niveau de confiance textuel
        conf_level = "Faible"
        if avg_conf > 0.85:
            conf_level = "Élevé"
        elif avg_conf > 0.6:
            conf_level = "Moyen"

        return {
            "count": count,
            "description": f"Analyse locale (MediaPipe) : {count} personne(s) détectée(s).",
            "confidenceLevel": conf_level
        }

    except Exception as error:
        # En production, log l'erreur réelle ici
        print(f"Erreur MediaPipe: {error}")
        raise RuntimeError(f"Erreur lors de l'analyse d'image")