@echo off
REM Script de lancement pour CountAI (Windows)

echo.
echo ========================================
echo   CountAI - Comptage par Intelligence Artificielle
echo ========================================
echo   KENNE KEYANYEM FRANK & TAMBA MBE YOHAN
echo ========================================
echo.

REM Vérifier si Python est installé
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Erreur: Python n'est pas installé ou n'est pas dans le PATH
    pause
    exit /b 1
)

REM Créer l'environnement virtuel s'il n'existe pas
if not exist "venv" (
    echo Création de l'environnement virtuel...
    python -m venv venv
)

REM Activer l'environnement virtuel
call venv\Scripts\activate.bat

REM Installer les dépendances
echo Installation des dépendances...
pip install -r requirements.txt


REM Lancer l'application
echo.
echo Démarrage de l'application sur http://localhost:5000
echo.
python app.py

pause
