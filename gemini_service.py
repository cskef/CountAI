"""
Service pour analyser les images avec Google Gemini API.
Compte le nombre de personnes présentes dans une image.
"""

import json
import base64
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

# Initialiser le client Gemini
client = genai.Client(api_key=os.getenv('API_KEY'))


def count_people_in_image(base64_data: str, mime_type: str) -> dict:

    try:
        # Préparer le texte du prompt
        prompt_text = """Analyse cette image et compte le nombre d'êtres humains visibles. 
Ne compte pas les dessins animés, les statues ou les reflets si possible.
Sois précis.

Réponds UNIQUEMENT au format JSON avec ces champs:
{
    "count": <nombre entier>,
    "description": "<brève description de la scène en français, max 2 phrases>",
    "confidenceLevel": "<Élevé|Moyen|Faible>"
}"""

        # Créer la requête avec l'image en base64
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                {
                    "role": "user",
                    "parts": [
                        {
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": base64_data,
                            }
                        },
                        {
                            "text": prompt_text
                        }
                    ]
                }
            ],
        )

        if response.text:
            # Extraire le JSON de la réponse
            result = json.loads(response.text)
            return result
        else:
            raise ValueError("Aucune réponse textuelle reçue de l'IA.")

    except json.JSONDecodeError as e:
        raise ValueError(f"Erreur lors du parsing de la réponse JSON de l'IA: {str(e)}")
    except Exception as error:
        raise RuntimeError(f"Impossible d'analyser l'image: {str(error)}")
