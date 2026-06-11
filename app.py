"""
Employee Attrition Prediction — Flask Web Application
======================================================
Run:  python app.py
Then open  http://127.0.0.1:5000
"""

import os
import numpy as np
import pandas as pd
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib

# ── Paths ───────────────────────────────────────────────────────────────────────
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR   = os.path.join(BASE_DIR, "model")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
BUILD_DIR   = os.path.join(FRONTEND_DIR, "dist")
ARTIFACTS   = joblib.load(os.path.join(MODEL_DIR, "artifacts.pkl"))

model           = ARTIFACTS["model"]
scaler          = ARTIFACTS["scaler"]
label_encoders  = ARTIFACTS["label_encoders"]
feature_names   = ARTIFACTS["feature_names"]
categorical_cols = ARTIFACTS["categorical_cols"]
numeric_cols    = ARTIFACTS["numeric_cols"]
MODEL_NAME      = ARTIFACTS["model_name"]

# ── Form Field Metadata ────────────────────────────────────────────────────────
# Human-friendly labels, ranges and defaults for every feature the model expects.
FIELD_META = {
    "Age":                      {"label": "Age",                      "min": 18,  "max": 65,  "step": 1,    "default": 36},
    "DailyRate":                {"label": "Daily Rate ($)",           "min": 100, "max": 1500,"step": 10,   "default": 800},
    "DistanceFromHome":         {"label": "Distance from Home (mi)",  "min": 0,   "max": 30,  "step": 1,    "default": 7},
    "Education":                {"label": "Education Level",          "choices": {1: "Below College", 2: "College", 3: "Bachelor", 4: "Master", 5: "Doctor"}},
    "EnvironmentSatisfaction":  {"label": "Environment Satisfaction", "min": 1,   "max": 4,   "step": 1,    "default": 3},
    "HourlyRate":               {"label": "Hourly Rate ($)",          "min": 30,  "max": 100, "step": 1,    "default": 65},
    "JobInvolvement":           {"label": "Job Involvement",          "min": 1,   "max": 4,   "step": 1,    "default": 3},
    "JobLevel":                 {"label": "Job Level",                "min": 1,   "max": 5,   "step": 1,    "default": 2},
    "JobSatisfaction":          {"label": "Job Satisfaction",         "min": 1,   "max": 4,   "step": 1,    "default": 3},
    "MonthlyIncome":            {"label": "Monthly Income ($)",       "min": 1000,"max": 20000,"step": 500,  "default": 6500},
    "MonthlyRate":              {"label": "Monthly Rate ($)",         "min": 2000,"max": 27000,"step": 500,  "default": 14000},
    "NumCompaniesWorked":       {"label": "Companies Worked At",      "min": 0,   "max": 10,  "step": 1,    "default": 2},
    "PercentSalaryHike":        {"label": "Percent Salary Hike",      "min": 0,   "max": 25,  "step": 1,    "default": 14},
    "PerformanceRating":        {"label": "Performance Rating",       "min": 1,   "max": 5,   "step": 1,    "default": 3},
    "RelationshipSatisfaction": {"label": "Relationship Satisfaction","min": 1,   "max": 4,   "step": 1,    "default": 3},
    "StockOptionLevel":         {"label": "Stock Option Level",       "min": 0,   "max": 3,   "step": 1,    "default": 1},
    "TotalWorkingYears":        {"label": "Total Working Years",      "min": 0,   "max": 40,  "step": 1,    "default": 10},
    "TrainingTimesLastYear":    {"label": "Trainings Last Year",      "min": 0,   "max": 6,   "step": 1,    "default": 2},
    "WorkLifeBalance":          {"label": "Work-Life Balance",        "min": 1,   "max": 4,   "step": 1,    "default": 3},
    "YearsAtCompany":           {"label": "Years at Company",         "min": 0,   "max": 40,  "step": 1,    "default": 7},
    "YearsInCurrentRole":       {"label": "Years in Current Role",    "min": 0,   "max": 18,  "step": 1,    "default": 5},
    "YearsSinceLastPromotion":  {"label": "Years Since Last Promotion","min": 0,  "max": 15,  "step": 1,    "default": 2},
    "YearsWithCurrManager":     {"label": "Years with Current Manager","min": 0, "max": 17,  "step": 1,    "default": 5},
    # Categorical (original string values — we reverse the LabelEncoder)
    "BusinessTravel":    {"label": "Business Travel",    "choices": {"Travel_Rarely": "Travel Rarely",
                                                                      "Travel_Frequently": "Travel Frequently",
                                                                      "Non-Travel": "No Travel"}},
    "Department":        {"label": "Department",         "choices": {"Sales": "Sales",
                                                                      "Research & Development": "Research & Development",
                                                                      "Human Resources": "Human Resources"}},
    "EducationField":    {"label": "Education Field",    "choices": {"Life Sciences": "Life Sciences",
                                                                      "Medical": "Medical",
                                                                      "Other": "Other",
                                                                      "Marketing": "Marketing",
                                                                      "Technical Degree": "Technical Degree",
                                                                      "Human Resources": "Human Resources"}},
    "Gender":            {"label": "Gender",             "choices": {"Female": "Female", "Male": "Male"}},
    "JobRole":           {"label": "Job Role",           "choices": {"Sales Executive": "Sales Executive",
                                                                      "Research Scientist": "Research Scientist",
                                                                      "Laboratory Technician": "Laboratory Technician",
                                                                      "Manager": "Manager",
                                                                      "Healthcare Representative": "Healthcare Representative",
                                                                      "Sales Representative": "Sales Representative",
                                                                      "Research Director": "Research Director",
                                                                      "Manufacturing Director": "Manufacturing Director",
                                                                      "Human Resources": "Human Resources"}},
    "MaritalStatus":     {"label": "Marital Status",     "choices": {"Single": "Single", "Married": "Married", "Divorced": "Divorced"}},
    "OverTime":          {"label": "Overtime",           "choices": {"Yes": "Yes", "No": "No"}},
}

# ── Flask App ───────────────────────────────────────────────────────────────────
app = Flask(__name__, static_folder=BUILD_DIR, static_url_path="")
CORS(app, resources={r"/api/*": {"origins": "*"}})


def frontend_available():
    return os.path.exists(os.path.join(BUILD_DIR, "index.html"))


@app.route("/api/predict", methods=["POST"])
def api_predict():
    data = request.get_json(force=True)
    if data is None:
        return jsonify({"error": "Invalid JSON payload"}), 400

    ENGINEERED = {"IncomePerYear", "TenureRatio", "PromotionGap", "SatisfactionAvg"}

    form_data = {}
    for col in feature_names:
        if col in ENGINEERED:
            continue  # computed below from raw inputs
        if col not in data:
            return jsonify({"error": f"Missing field '{col}'"}), 400
        raw = data[col]
        if col in categorical_cols:
            le = label_encoders[col]
            try:
                form_data[col] = le.transform([raw])[0]
            except Exception:
                return jsonify({"error": f"Invalid value for '{col}': {raw}"}), 400
        else:
            try:
                form_data[col] = float(raw)
            except ValueError:
                return jsonify({"error": f"Field '{col}' must be numeric"}), 400

    # Compute engineered features (added during training)
    if "IncomePerYear" in feature_names:
        form_data["IncomePerYear"] = form_data.get("MonthlyIncome", 0) * 12
    if "TenureRatio" in feature_names:
        form_data["TenureRatio"] = form_data.get("YearsAtCompany", 0) / (form_data.get("TotalWorkingYears", 0) + 1)
    if "PromotionGap" in feature_names:
        form_data["PromotionGap"] = form_data.get("YearsAtCompany", 0) - form_data.get("YearsSinceLastPromotion", 0)
    if "SatisfactionAvg" in feature_names:
        form_data["SatisfactionAvg"] = (
            form_data.get("JobSatisfaction", 3) +
            form_data.get("EnvironmentSatisfaction", 3) +
            form_data.get("RelationshipSatisfaction", 3)
        ) / 3

    X_input = pd.DataFrame([form_data])[feature_names]
    X_scaled = pd.DataFrame(scaler.transform(X_input), columns=feature_names)

    proba = model.predict_proba(X_scaled)[0]
    pred = model.predict(X_scaled)[0]
    label = "Yes — Likely to Leave" if pred == 1 else "No — Likely to Stay"
    risk_pct = round(proba[1] * 100, 1)

    if risk_pct < 20:
        risk_level = "Low"
        risk_color = "#27ae60"
    elif risk_pct < 50:
        risk_level = "Moderate"
        risk_color = "#f39c12"
    else:
        risk_level = "High"
        risk_color = "#e74c3c"

    return jsonify({
        "label": label,
        "risk_pct": risk_pct,
        "risk_level": risk_level,
        "risk_color": risk_color,
        "model_name": MODEL_NAME,
    })


@app.route("/predict", methods=["POST"])
def predict():
    """Receive form data → preprocess → predict → return result."""
    form_data = {}
    for col in feature_names:
        raw = request.form.get(col)
        if col in categorical_cols:
            # Map friendly form value back to encoded int
            le = label_encoders[col]
            form_data[col] = le.transform([raw])[0]
        else:
            form_data[col] = float(raw)

    # Build DataFrame in exact feature order
    X_input = pd.DataFrame([form_data])[feature_names]

    # Scale
    X_scaled = pd.DataFrame(scaler.transform(X_input), columns=feature_names)

    # Predict
    proba    = model.predict_proba(X_scaled)[0]
    pred     = model.predict(X_scaled)[0]
    label    = "Yes — Likely to Leave" if pred == 1 else "No — Likely to Stay"
    risk_pct = round(proba[1] * 100, 1)   # probability of attrition

    # Risk level badge
    if risk_pct < 20:
        risk_level = "Low"
        risk_color = "#27ae60"
    elif risk_pct < 50:
        risk_level = "Moderate"
        risk_color = "#f39c12"
    else:
        risk_level = "High"
        risk_color = "#e74c3c"

    return render_template(
        "result.html",
        label=label,
        risk_pct=risk_pct,
        risk_level=risk_level,
        risk_color=risk_color,
        model_name=MODEL_NAME,
    )


@app.route("/api/analytics")
def api_analytics():
    """Return summary analytics from the training dataset."""
    data_path = os.path.join(BASE_DIR, "HR-Employee-Attrition.csv")
    if not os.path.exists(data_path):
        return jsonify({"error": "Dataset not found"}), 404

    df = pd.read_csv(data_path)
    total = len(df)
    attrition_count = (df["Attrition"] == "Yes").sum()
    attrition_rate = round(attrition_count / total * 100, 1)
    avg_age = round(df["Age"].mean(), 1)
    departments = df["Department"].nunique()

    return jsonify({
        "total_employees": f"{total:,}",
        "attrition_rate": f"{attrition_rate}%",
        "avg_age": str(avg_age),
        "departments": str(departments),
        "attrition_count": int(attrition_count),
        "stayed_count": int(total - attrition_count),
    })


@app.route("/api/model-info")
def api_model_info():
    """Return model metadata and evaluation info."""
    has_fi = os.path.exists(os.path.join(BASE_DIR, "static", "plots", "feature_importance.png"))
    return jsonify({
        "model_name": MODEL_NAME,
        "n_features": str(len(feature_names)),
        "train_samples": "1,176",
        "test_samples": "294",
        "has_feature_importance": has_fi,
        "categorical_features": len(categorical_cols),
        "numeric_features": len(numeric_cols),
    })


@app.route("/api/plots/<filename>")
def api_plots(filename):
    """Serve EDA and evaluation plot images."""
    plots_dir = os.path.join(BASE_DIR, "static", "plots")
    return send_from_directory(plots_dir, filename)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if frontend_available():
        if path != "" and os.path.exists(os.path.join(BUILD_DIR, path)):
            return send_from_directory(BUILD_DIR, path)
        return send_from_directory(BUILD_DIR, "index.html")

    fields = []
    for col in feature_names:
        meta = FIELD_META.get(col, {})
        fields.append({"name": col, **meta})
    return render_template("index.html", fields=fields, model_name=MODEL_NAME)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV", "development") == "development"
    print(f"Model loaded: {MODEL_NAME}")
    print(f"Features    : {len(feature_names)}")
    app.run(debug=debug, host="0.0.0.0", port=port)
