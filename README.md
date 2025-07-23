# Sudoku App 🧩

Application web de Sudoku avec différentes difficultés, chronomètre et classement en ligne.

## 🚀 Fonctionnalités

- Génération de grilles de Sudoku selon 3 niveaux : facile, moyen, difficile
- Interface réactive avec React
- Chronomètre pour mesurer le temps de résolution
- Leaderboard connecté à MongoDB pour enregistrer les meilleurs scores
- API Node.js + Express pour la gestion des scores

## 🛠️ Stack technique

- Frontend : React, Tailwind CSS
- Backend : Node.js, Express
- Base de données : MongoDB (via Mongoose)
- Autres : dotenv, cors, nodemon, etc.

## 📦 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/ton-pseudo/sudoku-app.git
cd sudoku-app
```

### 2. Installer les dépendances
```cd frontend
npm install

cd ../backend
npm install
```

### 3.Fichier .env requis dans le dossier backend
```bash
MONGO_URI=your_mongo_connection_string
DB_NAME=sudoku
```

### 4. Lancer en développement
```bash
cd backend
node server.js

cd app-sudoku
npm run dev
```

Accès : --

Réalisé par Léo P.
