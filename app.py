"""
Application Flask pour le comptage de personnes avec IA.
Compteur instantané propulsé par l'IA Google Gemini.
"""

import os
import base64
import json
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from gemini_service import count_people_in_image

load_dotenv()

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size


@app.route('/')
def index():
    """Affiche la page principale de l'application."""
    return render_template('index.html')


@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    """
    Endpoint pour analyser une image et compter les personnes.
    
    Accepte une requête POST avec:
    - data: la chaîne base64 de l'image
    - mimeType: le type MIME de l'image
    
    Retourne un JSON avec:
    - count: nombre de personnes
    - description: description de la scène
    - confidenceLevel: niveau de confiance
    """
    try:
        data = request.get_json()
        
        if not data or 'data' not in data or 'mimeType' not in data:
            return jsonify({'error': 'Données manquantes'}), 400
        
        base64_data = data['data']
        mime_type = data['mimeType']
        
        # Valider le type MIME
        if not mime_type.startswith('image/'):
            return jsonify({'error': 'Le fichier doit être une image'}), 400
        
        # Analyser l'image
        result = count_people_in_image(base64_data, mime_type)
        
        return jsonify(result), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except RuntimeError as e:
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'Erreur serveur'}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Vérifier que le serveur fonctionne."""
    api_key = os.getenv('API_KEY')
    if not api_key:
        return jsonify({'status': 'error', 'message': 'API_KEY non configurée'}), 500
    return jsonify({'status': 'ok'}), 200


@app.errorhandler(413)
def request_entity_too_large(error):
    """Gestion des fichiers trop volumineux."""
    return jsonify({'error': 'Fichier trop volumineux (max 16MB)'}), 413


if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
