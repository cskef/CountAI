#!/bin/bash

# Script de lancement pour CountAI (macOS/Linux)

echo ""
echo "========================================"
echo "  CountAI - Comptage par Intelligence Artificielle"
echo "========================================"
echo "  KENNE KEYANYEM FRANK & TAMBA MBE YOHAN"
echo "========================================"
echo ""

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null; then
    echo "Erreur: Python 3 n'est pas installé"
    exit 1
fi

# Créer l'environnement virtuel s'il n'existe pas
if [ ! -d "venv" ]; then
    echo "Création de l'environnement virtuel..."
    python3 -m venv venv
fi

# Activer l'environnement virtuel
source venv/bin/activate

# Installer les dépendances
echo "Installation des dépendances..."
pip install -r requirements.txt

# Lancer l'application
echo ""
echo "Démarrage de l'application sur http://localhost:5000"
echo ""
python app.py
