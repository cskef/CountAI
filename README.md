<!-- Header -->
<div align="center">

# 🤖 CountAI

### Analyse Intelligente de Foule par Vision Artificielle

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-green?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-API-red?logo=google&logoColor=white)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)]()

*Comptez les personnes en photos avec l'intelligence artificielle - Rapide • Précis • Fiable*

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
- [🛡️ Sécurité](#️-sécurité)
- [❓ Troubleshooting](#-troubleshooting)
- [📚 Ressources](#-ressources)
- [📄 Licence](#-licence)

---

## ✨ Caractéristiques

CountAI est une application web moderne de comptage de personnes qui combine la puissance de l'intelligence artificielle avec une interface intuitive et responsive.

### Fonctionnalités Principales

| Fonctionnalité | Description |
|---|---|
| 📤 **Import d'images** | Chargez vos photos depuis votre ordinateur |
| 📷 **Capture caméra** | Prenez des photos en direct avec votre webcam |
| 🎯 **Analyse IA** | Détection automatique de personnes avec Google Gemini |
| 📊 **Résultats détaillés** | Comptage, description et niveau de confiance |
| 💾 **Historique** | Accès rapide à vos analyses précédentes |
| 📱 **Interface Responsive** | Adapté pour desktop, tablette et mobile |
| ⚡ **Performance** | Analyse en temps réel sans dépendances externes |

---

## 🚀 Démarrage Rapide

### ⏱️ Installation en 5 minutes

#### 1️⃣ Obtenir une clé API Gemini (gratuit)

```bash
1. Allez sur https://ai.google.dev
2. Cliquez sur "Get started"
3. Créez un nouveau projet
4. Générez une clé API
5. Copiez-la
```

#### 2️⃣ Configuration Automatique

**Windows:**
```bash
run.bat
```

**macOS/Linux:**
```bash
chmod +x run.sh
./run.sh
```

#### 3️⃣ Configurer l'API

Ouvrez `.env` et remplacez:
```env
API_KEY=votre_clé_gemini_ici
```

#### 4️⃣ Accéder à l'application

```
http://localhost:5000
```

---

## 📦 Installation Complète

### Prérequis

- **Python 3.8+** - [Télécharger](https://www.python.org/)
- **Clé API Google Gemini** (gratuite) - [Créer une clé](https://ai.google.dev)

### Étapes Installation

<details>
<summary><b>📋 Voir les étapes complètes</b></summary>

#### Étape 1: Cloner/Télécharger le projet

```bash
git clone https://github.com/yourusername/countai.git
cd countai
```

#### Étape 2: Créer un environnement virtuel

```bash
python -m venv venv
```

#### Étape 3: Activer l'environnement

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

#### Étape 4: Installer les dépendances

```bash
pip install -r requirements.txt
```

#### Étape 5: Configurer l'API

```bash
# Créer le fichier .env depuis l'exemple
cp .env.example .env

# Ou sur Windows:
copy .env.example .env
```

Éditez `.env` et ajoutez votre clé API:
```env
API_KEY=votre_clé_gemini_ici
FLASK_ENV=development
FLASK_DEBUG=1
```

#### Étape 6: Lancer l'application

```bash
python app.py
```

Accédez à: **http://localhost:5000** ✅

</details>

---

## 🏗️ Architecture

### Stack Technologique

#### Backend
```
Python 3.8+
  ↓
Flask 3.0 (Web Framework)
  ↓
Google Gemini API (Vision IA)
```

#### Frontend
```
HTML5 (Structure)
  ↓
CSS3 Vanilla (Design System)
  ↓
JavaScript Vanilla (State Management)
```

### Structure du Projet

```
countai/
├── 📄 app.py                 # Application Flask principale
├── 📄 gemini_service.py      # Service d'analyse Gemini
├── 📄 requirements.txt       # Dépendances Python
├── 📄 .env.example           # Configuration exemple
├── 📁 templates/
│   └── index.html            # Interface web
├── 📁 static/
│   ├── style.css             # Design system CSS
│   └── script.js             # Logique JavaScript
└── 📄 README.md              # Cette documentation
```

### Dépendances Python

| Package | Version | Rôle |
|---------|---------|------|
| Flask | 3.0.0 | Framework web léger |
| python-dotenv | 1.0.0 | Configuration sécurisée |
| google-genai | 0.3.0 | Client Gemini IA |
| Pillow | 10.1.0 | Traitement d'images |

---

## 📖 Utilisation

### Flux Utilisateur

```
1. 📤 IMPORT/CAPTURE
   ├─ Importer une photo (fichier)
   └─ Prendre une photo (caméra)

2. 👁️ APERÇU
   ├─ Visualiser l'image
   └─ Vérifier dimensions/taille

3. 🔄 ANALYSE
   ├─ Envoyer à Gemini API
   └─ Recevoir résultats JSON

4. 📊 RÉSULTATS
   ├─ Nombre de personnes
   ├─ Description de scène
   └─ Niveau de confiance

5. 💾 HISTORIQUE
   └─ Accès aux analyses précédentes
```

### Fonctionnalités Détaillées

#### 📤 Import d'Images
- Sélectionnez une image depuis votre ordinateur
- Format: JPG, PNG, GIF, WEBP
- Limite: 16MB maximum

#### 📷 Capture Caméra
- Accès à votre webcam en temps réel
- Résolution: jusqu'à 1920x1080
- Permissions nécessaires: autorisées par le navigateur

#### 🎯 Analyse Intelligente
- Détection des personnes via Gemini Vision
- Description textuelle de la scène
- Score de confiance (0-100%)

#### 💾 Historique
- Stockage local des analyses
- Accès rapide aux résultats précédents
- Export en TXT/PDF

---

## ⚙️ Configuration

### Variables d'Environnement

```env
API_KEY=votre_clé_api_gemini_ici     # Obligatoire
FLASK_ENV=development                 # development/production
FLASK_DEBUG=1                         # 0/1 (mode debug)
```

### Configuration Avancée

#### Pour Production

```env
API_KEY=votre_clé_production_ici
FLASK_ENV=production
FLASK_DEBUG=0
```

Consultez [DEPLOY.md](DEPLOY.md) pour un déploiement en production.

---

## 🔧 API & Technique
