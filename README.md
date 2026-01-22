<div align="center">

# 🤖 CountAI

### Analyse Intelligente de Foule par Vision Locale (YOLOv8)

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-green?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![YOLOv8](https://img.shields.io/badge/AI-YOLOv8-purple?logo=pytorch&logoColor=white)](https://github.com/ultralytics/ultralytics)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Beta-orange)]()

*Comptez les personnes en photos instantanément avec une IA locale - Rapide • Privé*

</div>

---

## 📋 Table des Matières

- [✨ Caractéristiques](#-caractéristiques)
- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [📦 Installation Complète](#-installation-complète)
- [🏗️ Architecture](#️-architecture)
- [📖 Utilisation](#-utilisation)
- [⚙️ Configuration](#️-configuration)
- [🔧 API & Technique](#-api--technique)
- [📚 Ressources](#-ressources)
- [📄 Licence](#-licence)

---

## ✨ Caractéristiques

CountAI est une application web de comptage de personnes utilisant un modèle de Deep Learning local, garantissant confidentialité et performance sans dépendance à une API externe.

### Fonctionnalités Principales

| Fonctionnalité | Description |
|---|---|
| 📤 **Import d'images** | Chargez vos photos (JPG, PNG, WEBP) |
| 📷 **Capture caméra** | Flux vidéo en direct pour capture instantanée |
| 🧠 **IA Locale** | Détection via **YOLOv8 Nano** |
| ⚡ **Temps Réel** | Inférence rapide (CPU/GPU) sans latence réseau |
| 📊 **Résultats** | Comptage précis et niveau de confiance algorithmique |
| 🛡️ **Confidentialité** | Aucune image n'est envoyée sur le cloud |
| 📱 **Responsive** | Interface adaptative mobile et desktop |

---

## 🚀 Démarrage Rapide

### ⏱️ Installation en 2 minutes

#### 1️⃣ Préparer l'environnement
Assurez-vous d'avoir Python 3.8+ installé sur votre machine.

#### 2️⃣ Lancement Automatique

**Windows:**
```bash
run.bat

```

**macOS/Linux:**

```bash
chmod +x run.sh
./run.sh

```

*Le script se chargera d'installer les dépendances et de télécharger le modèle `yolov8n.pt` au premier lancement s'il n'existe pas encore.*

#### 3️⃣ Accéder à l'application

Ouvrez votre navigateur :

```
http://localhost:5000

```

---

## 📦 Installation Complète

### Prérequis

* **Python 3.8+** - [Télécharger](https://www.python.org/)
* **RAM** : Min 4GB recommandé pour l'inférence fluide.

### Étapes Manuelles

<details>
<summary><b>📋 Voir les étapes détaillées</b></summary>

#### Étape 1: Cloner le projet

```bash
git clone [https://github.com/cskef/countai.git](https://github.com/cskef/countai.git)
cd countai

```

#### Étape 2: Environnement virtuel

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

```

#### Étape 3: Installer les dépendances

Le projet utilise désormais `ultralytics` pour la vision par ordinateur.

```bash
pip install -r requirements.txt

```

#### Étape 4: Configuration

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Ou sur Windows:
copy .env.example .env

```

*Note : Aucune clé API n'est requise. Le `.env` sert uniquement à la configuration Flask.*

#### Étape 5: Lancer le serveur

```bash
python app.py

```

*Le modèle YOLOv8n (environ 6MB) sera téléchargé automatiquement lors de la première analyse s'il n'est pas présent.*

</details>

---

## 🏗️ Architecture

Voici l'architecture...

### Stack Technologique

#### Backend

```
Python 3.8+
  ↓
Flask 3.0 (Serveur Web)
  ↓
Ultralytics YOLOv8 (Moteur d'inférence local)
  ↓
Modèle: yolov8n.pt (Détection d'objets)

```

#### Frontend

```
HTML5 / CSS3 / Vanilla JS
(Gestion de la caméra et affichage asynchrone)

```

### Structure des Fichiers

```
countai/
├── 📄 app.py                 # Point d'entrée Flask
├── 📄 service.py             # Logique d'inférence YOLOv8
├── 📄 requirements.txt       # Dépendances
├── 📄 yolov8n.pt             # Modèle IA
├── 📁 templates/
│   └── index.html            # Interface utilisateur
├── 📁 static/
│   ├── style.css             # Styles
│   └── script.js             # Logique client
└── 📄 README.md              # Documentation

```

### Dépendances Python Clés

| Package | Usage |
| --- | --- |
| `flask` | Serveur web et API REST |
| `ultralytics` | Implémentation de YOLOv8 |
| `pillow` | Manipulation d'images avant inférence |

---

## 📖 Utilisation

1. **Lancer l'app** : `python app.py`
2. **Interface** :
* Cliquez sur **Importer** pour uploader un fichier.
* Ou **Caméra** pour prendre une photo via la webcam.


3. **Analyse** :
* Le backend charge l'image en mémoire.
* YOLOv8 détecte les objets de classe `0` (Personnes).
* L'image n'est **jamais stockée** sur le disque (traitement en flux).


4. **Résultat** : Affichage immédiat du nombre de personnes.

---

## ⚙️ Configuration

Le fichier `.env` contrôle les paramètres du serveur Flask.

```env
# Configuration Serveur
FLASK_ENV=development      # development / production
FLASK_DEBUG=1              # 1 pour activer le rechargement auto
MAX_CONTENT_LENGTH=16777216 # Taille max upload (16MB)

```

---

## 🔧 API & Technique

### Endpoint `/api/analyze`

**Méthode** : `POST`

**Content-Type** : `application/json`

**Corps de la requête :**

```json
{
  "data": "base64_encoded_image_string...",
  "mimeType": "image/jpeg"
}

```

**Réponse (200 OK) :**

```json
{
  "count": 12,
  "description": "Détection : 12 personne(s) détectée(s).",
  "confidenceLevel": "Élevé"
}

```

---

## 📚 Ressources

* [Ultralytics YOLOv8 Docs](https://docs.ultralytics.com/)
* [Flask Documentation](https://flask.palletsprojects.com/)

---

## 📄 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

```

```