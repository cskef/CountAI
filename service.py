"""
Service d'analyse d'image utilisant YOLOv8.
"""

import io
import base64
from PIL import Image
from ultralytics import YOLO


print("Chargement du modèle YOLOv8...")
model = YOLO('yolov8n.pt')
print("Modèle chargé.")

def count_people_in_image(base64_data: str, mime_type: str) -> dict:
    try:
        # 1. Décoder l'image Base64 (Utilisation de Pillow, pas d'OpenCV)
        image_bytes = base64.b64decode(base64_data)
        image = Image.open(io.BytesIO(image_bytes))

        # 2. Inférence (Détection)
        # classes=[0] signifie qu'on ne cherche que la classe "Personne"
        # conf=0.4 est le seuil de confiance (40%)
        results = model.predict(image, classes=[0], conf=0.4, verbose=False)

        # 3. Comptage
        # results[0] contient le premier (et unique) résultat de l'image
        count = len(results[0].boxes)
        
        # Calcul de la confiance moyenne (optionnel)
        conf_scores = results[0].boxes.conf.tolist() # Récupère les scores
        avg_conf = (sum(conf_scores) / count) if count > 0 else 0

        # Niveau de confiance textuel
        conf_level = "Faible"
        if avg_conf > 0.8:
            conf_level = "Élevé"
        elif avg_conf > 0.6:
            conf_level = "Moyen"

        return {
            "count": count,
            "description": f"Détection : {count} personne(s) détectée(s).",
            "confidenceLevel": conf_level
        }

    except Exception as error:
        print(f"Erreur YOLO: {error}")
        raise RuntimeError(f"Impossible de traiter l'image : {str(error)}")