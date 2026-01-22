/**
 * Application CountAI - Système de gestion d'état et IHM
 * Conception centrée utilisateur avec feedback immédiat et navigation intuitive
 */

// ========================================
// ÉTAT APPLICATIF ET CONFIGURATION
// ========================================

const AppState = {
    IDLE: 'IDLE',
    CAMERA: 'CAMERA',
    PREVIEW: 'PREVIEW',
    ANALYZING: 'ANALYZING',
    RESULT: 'RESULT',
    ERROR: 'ERROR'
};

let currentState = AppState.IDLE;
let imageFile = null;
let mediaStream = null;
let analysisHistory = [];

// DOM Elements
const elements = {
    // Navigation
    historyToggle: document.getElementById('history-toggle'),
    helpToggle: document.getElementById('help-toggle'),
    helpClose: document.getElementById('help-close'),
    
    // Sidebars
    historySidebar: document.getElementById('history-sidebar'),
    historyList: document.getElementById('history-list'),
    clearHistoryBtn: document.getElementById('clear-history'),
    helpSidebar: document.getElementById('help-sidebar'),
    
    // Etats
    stateIdle: document.getElementById('idle-state'),
    stateCamera: document.getElementById('camera-state'),
    statePreview: document.getElementById('preview-state'),
    stateAnalyzing: document.getElementById('analyzing-state'),
    stateResult: document.getElementById('result-state'),
    stateError: document.getElementById('error-state'),
    
    // Actions
    fileInput: document.getElementById('file-input'),
    uploadCard: document.querySelector('.upload-card'),
    cameraBtn: document.getElementById('camera-btn'),
    cameraCard: document.querySelector('.camera-card'),
    
    // Camera
    videoFeed: document.getElementById('video-feed'),
    canvas: document.getElementById('canvas'),
    closeCameraBtn: document.getElementById('close-camera'),
    captureBtn: document.getElementById('capture-btn'),
    retakeBtn: document.getElementById('retake-btn'),
    
    // Aperçu
    previewImage: document.getElementById('preview-image'),
    analyzeBtn: document.getElementById('analyze-btn'),
    backPreviewBtn: document.getElementById('back-preview-btn'),
    imageSizeInfo: document.getElementById('image-size'),
    imageBytes: document.getElementById('image-bytes'),
    
    // Resultat
    resultCount: document.getElementById('result-count'),
    resultDescription: document.getElementById('result-description'),
    resultConfidence: document.getElementById('result-confidence'),
    exportBtn: document.getElementById('export-btn'),
    resetBtn: document.getElementById('reset-btn'),
    
    // Erreur
    errorMessage: document.getElementById('error-message'),
    errorRetryBtn: document.getElementById('error-retry-btn'),
    errorHomeBtn: document.getElementById('error-home-btn'),
};

// ========================================
// INITIALISATION DES ÉVÉNEMENTS
// ========================================

function initEventListeners() {
    // Navigation
    elements.historyToggle.addEventListener('click', toggleHistorySidebar);
    elements.helpToggle.addEventListener('click', toggleHelpSidebar);
    elements.helpClose.addEventListener('click', toggleHelpSidebar);
    elements.clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Actions principales
    elements.uploadCard.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileUpload);
    elements.cameraCard.addEventListener('click', startCameraMode);
    
    // Camera
    elements.closeCameraBtn.addEventListener('click', closeCameraMode);
    elements.captureBtn.addEventListener('click', handleCameraCapture);
    elements.retakeBtn.addEventListener('click', retakePhoto);
    
    // Aperçu
    elements.backPreviewBtn.addEventListener('click', backToIdle);
    elements.analyzeBtn.addEventListener('click', runAnalysis);
    
    // Resultats
    elements.exportBtn.addEventListener('click', exportReport);
    elements.resetBtn.addEventListener('click', resetApp);
    
    // Erreurs
    elements.errorRetryBtn.addEventListener('click', retryAnalysis);
    elements.errorHomeBtn.addEventListener('click', resetApp);
}

// ========================================
// GESTION D'ÉTAT DE L'APPLICATION
// ========================================

function setState(newState) {
    currentState = newState;
    
    // Masquer tous les états
    document.querySelectorAll('.state-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Afficher l'état actuel
    switch (newState) {
        case AppState.IDLE:
            elements.stateIdle.classList.add('active');
            break;
        case AppState.CAMERA:
            elements.stateCamera.classList.add('active');
            break;
        case AppState.PREVIEW:
            elements.statePreview.classList.add('active');
            break;
        case AppState.ANALYZING:
            elements.stateAnalyzing.classList.add('active');
            break;
        case AppState.RESULT:
            elements.stateResult.classList.add('active');
            break;
        case AppState.ERROR:
            elements.stateError.classList.add('active');
            break;
    }
}

// ========================================
// NAVIGATION & SIDEBARS
// ========================================

function toggleHistorySidebar() {
    elements.historySidebar.classList.toggle('active');
    if (elements.historySidebar.classList.contains('active')) {
        elements.helpSidebar.classList.remove('active');
    }
}

function toggleHelpSidebar() {
    elements.helpSidebar.classList.toggle('active');
    if (elements.helpSidebar.classList.contains('active')) {
        elements.historySidebar.classList.remove('active');
    }
}

function updateHistoryDisplay() {
    if (analysisHistory.length === 0) {
        elements.historyList.innerHTML = '<p class="empty-state">Aucune analyse pour le moment</p>';
        return;
    }
    
    elements.historyList.innerHTML = analysisHistory
        .map((item, index) => { // Note: on map d'abord, on reverse après via CSS ou logique d'affichage, ou ici on garde l'ordre inverse des index
            // Calcul de l'index inversé pour l'affichage correct
             return { item, originalIndex: index };
        })
        .reverse()
        .map(({ item, originalIndex }) => `
            <div class="history-item" data-index="${originalIndex}">
                <img src="${item.thumbnail || ''}" class="history-thumb" alt="Miniature">
                <div class="history-info">
                    <div class="history-item-count">${item.count} pers.</div>
                    <div class="history-item-time">${new Date(item.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
            </div>
        `)
        .join('');
    
    document.querySelectorAll('.history-item').forEach(el => {
        el.addEventListener('click', () => {
            const index = parseInt(el.dataset.index);
            restoreFromHistory(index);
        });
    });
}

function clearHistory() {
    analysisHistory = [];
    updateHistoryDisplay();
}

function restoreFromHistory(index) {
    const item = analysisHistory[index];
    elements.resultCount.textContent = item.count;
    elements.resultDescription.textContent = item.description;
    elements.resultConfidence.textContent = item.confidenceLevel || '-';
    setState(AppState.RESULT);
    elements.historySidebar.classList.remove('active');
}

// ========================================
// GESTION DES FICHIERS ET CAMÉRA
// ========================================

function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showError('Veuillez sélectionner une image valide');
        return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
        const result = reader.result;
        const base64 = result.split(',')[1];
        const mimeType = result.match(/:(.*?);/)?.[1] || 'image/jpeg';
        
        imageFile = { data: base64, mimeType };
        displayImageInfo(file);
        elements.previewImage.src = result;
        setState(AppState.PREVIEW);
    };
    reader.readAsDataURL(file);
}

function displayImageInfo(file) {
    const img = new Image();
    img.onload = () => {
        elements.imageSizeInfo.textContent = `${img.width}×${img.height}px`;
    };
    img.src = URL.createObjectURL(file);
    
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    elements.imageBytes.textContent = sizeMB < 1 ? `${(file.size / 1024).toFixed(0)}KB` : `${sizeMB}MB`;
}

async function startCameraMode() {
    setState(AppState.CAMERA);
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false
        });
        elements.videoFeed.srcObject = mediaStream;
    } catch (err) {
        console.error("Erreur d'accès caméra:", err);
        showError("Impossible d'accéder à la caméra. Vérifiez vos permissions.");
        setState(AppState.IDLE);
    }
}

function closeCameraMode() {
    stopCamera();
    setState(AppState.IDLE);
}

function stopCamera() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
}

function handleCameraCapture() {
    if (!elements.videoFeed || !elements.canvas) return;
    
    const video = elements.videoFeed;
    const canvas = elements.canvas;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const base64 = dataUrl.split(',')[1];
        
        imageFile = { data: base64, mimeType: 'image/jpeg' };
        elements.previewImage.src = dataUrl;
        elements.imageSizeInfo.textContent = `${canvas.width}×${canvas.height}px`;
        elements.imageBytes.textContent = 'Photo caméra';
        setState(AppState.PREVIEW);
    }
}

function retakePhoto() {
    setState(AppState.CAMERA);
}

function backToIdle() {
    imageFile = null;
    setState(AppState.IDLE);
    elements.previewImage.src = '';
    elements.fileInput.value = '';
}

// ========================================
// ANALYSE D'IMAGE
// ========================================

async function runAnalysis() {
    if (!imageFile) return;
    
    setState(AppState.ANALYZING);
    
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: imageFile.data,
                mimeType: imageFile.mimeType
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de l\'analyse');
        }
        
        const result = await response.json();
        displayResult(result);
        addToHistory(result);
        setState(AppState.RESULT);
        
    } catch (error) {
        console.error('Erreur:', error);
        showError(error.message);
        setState(AppState.ERROR);
    }
}

function displayResult(result) {
    elements.resultCount.textContent = result.count;
    elements.resultDescription.textContent = result.description || 'N/A';
    
    if (result.confidenceLevel) {
        elements.resultConfidence.textContent = result.confidenceLevel;
    }
}

function addToHistory(result) {
    // Création de l'URL de l'image miniature
    let thumbUrl = null;
    
    // Si on a une image en mémoire
    if (imageFile && imageFile.data) {
        thumbUrl = `data:${imageFile.mimeType};base64,${imageFile.data}`;
    }

    analysisHistory.push({
        count: result.count,
        description: result.description,
        confidenceLevel: result.confidenceLevel,
        // Sauvegarde de l'image
        thumbnail: thumbUrl,
        timestamp: new Date().toISOString()
    });
    updateHistoryDisplay();
}

function retryAnalysis() {
    setState(AppState.PREVIEW);
}

// ========================================
// EXPORT & UTILITAIRES
// ========================================

function exportReport() {
    const report = `
RAPPORT D'ANALYSE COUNTAI
========================
Date: ${new Date().toLocaleString('fr-FR')}
Nombre de personnes: ${elements.resultCount.textContent}
Description: ${elements.resultDescription.textContent}
Confiance: ${elements.resultConfidence.textContent}

    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function showError(message) {
    elements.errorMessage.textContent = message;
}

function resetApp() {
    stopCamera();
    imageFile = null;
    setState(AppState.IDLE);
    elements.previewImage.src = '';
    elements.fileInput.value = '';
    elements.errorMessage.textContent = '';
    elements.historySidebar.classList.remove('active');
}

// ========================================
// INITIALISATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    setState(AppState.IDLE);
    console.log('✓ CountAI chargé - Interface prête');
});
