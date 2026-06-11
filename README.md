# Employee Attrition Prediction

This project predicts employee attrition using a Python Flask backend and a React frontend.

## What changed
- Added a React app in `frontend/` for interactive interface and HR storytelling.
- Added a Flask API endpoint at `/api/predict`.
- Kept the existing Flask template UI as a fallback when no React build is available.
- Added documentation for how the system works and how to run it.

## Run locally

### 1. Install Python dependencies

```powershell
cd "c:\Users\Jayy\OneDrive\Desktop\Employee Attrition Prediction"
pip install -r requirements.txt
```

### 2. Install React dependencies

```powershell
cd frontend
npm install
```

### 3. Start the Flask backend

```powershell
cd "c:\Users\Jayy\OneDrive\Desktop\Employee Attrition Prediction"
python app.py
```

The backend will run at `http://127.0.0.1:5000`.

### 4. Start the React frontend

```powershell
cd frontend
npm run dev
```

Open the Vite dev URL shown in the terminal (usually `http://127.0.0.1:5173`).

## Verify the project is working

- Visit the React frontend URL and submit the employee form.
- The app sends data to `http://127.0.0.1:5000/api/predict`.
- Check that the result panel shows a risk score and recommendations.
- If the React app is built, Flask can also serve the static frontend from `frontend/dist`.

## Preview of the project structure

- `app.py` — Flask backend and API endpoint.
- `train_model.py` — data preprocessing, model training, evaluation, and artifact saving.
- `model/` — saved model artifacts.
- `static/` — CSS and generated EDA plots.
- `templates/` — original Flask HTML templates.
- `frontend/` — new React application.

## Notes

- The React UI uses the same attrition model as the backend.
- The backend currently supports both web form predictions and JSON API predictions.
