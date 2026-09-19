# AR Medical Visualization System

An intelligent healthcare application combining **NLP**, **Augmented Reality**, and **3D Visualization** to help users understand medical reports through interactive heart model visualization.

## Architecture

```
├── frontend/          # React + Tailwind CSS + Framer Motion
├── backend/           # Spring Boot + Spring Security + JWT + MySQL
├── nlp-module/        # Python + Flask + SciSpaCy
└── unity-ar-module/   # Unity 6 + AR Foundation + ARCore
```

## Workflow

1. **User Login** → Register/authenticate via JWT
2. **Upload Medical Report** → PDF or text format
3. **NLP Analysis** → Detect cardiac condition and affected region
4. **View Results** → Interactive SVG heart diagram on web dashboard
5. **Launch AR** → Unity AR app highlights the affected heart region in 3D

## Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+ and Maven
- **Python** 3.9+
- **MySQL** 8.0+
- **Unity** 6 with AR Foundation (for AR module)

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
mvn spring-boot:run
```

### NLP Module
```bash
cd nlp-module
pip install -r requirements.txt
python app.py
```

### Unity AR Module
See `unity-ar-module/SETUP.md` for detailed Unity setup instructions.

## Tech Stack

| Module | Technologies |
|--------|-------------|
| Frontend | React.js, Tailwind CSS, Framer Motion, Axios, React Router |
| Backend | Spring Boot 3, Spring Security 6, JWT, JPA, MySQL, PDFBox |
| NLP | Python, Flask, SciSpaCy, NLTK |
| AR | Unity 6, AR Foundation, Google ARCore, Custom URP Shaders |

## Phase 1 Focus

This phase focuses exclusively on the **Human Heart**, supporting 15+ cardiac conditions mapped to specific anatomical regions.

## License

MIT
