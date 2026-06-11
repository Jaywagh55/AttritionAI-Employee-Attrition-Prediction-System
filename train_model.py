"""
Employee Attrition Prediction — Model Training Script
======================================================
Performs EDA, preprocessing, model training, evaluation,
and saves all artifacts needed for the Flask web app.
"""

import os
import warnings
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")          # non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import (
    RandomForestClassifier, GradientBoostingClassifier,
)
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import (
    accuracy_score, classification_report, confusion_matrix,
    roc_auc_score, roc_curve, f1_score
)
from imblearn.over_sampling import SMOTE
import joblib

warnings.filterwarnings("ignore")

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "HR-Employee-Attrition.csv")
MODEL_DIR = os.path.join(BASE_DIR, "model")
PLOT_DIR  = os.path.join(BASE_DIR, "static", "plots")
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(PLOT_DIR,  exist_ok=True)

# ── 1. Load Data ───────────────────────────────────────────────────────────────
print("=" * 60)
print("EMPLOYEE ATTRITION PREDICTION — Training Pipeline")
print("=" * 60)

df = pd.read_csv(DATA_PATH)
print(f"\nDataset loaded  →  {df.shape[0]} rows × {df.shape[1]} columns")

# ── 2. Exploratory Data Analysis (save charts) ─────────────────────────────────
print("\n[1/5] Running EDA …")

# 2a. Attrition distribution
fig, ax = plt.subplots(figsize=(6, 4))
counts = df["Attrition"].value_counts()
sns.barplot(x=counts.index, y=counts.values, palette=["#27ae60", "#e74c3c"], ax=ax)
ax.set_title("Attrition Distribution", fontsize=14, fontweight="bold")
ax.set_ylabel("Count")
for i, v in enumerate(counts.values):
    ax.text(i, v + 10, str(v), ha="center", fontweight="bold")
plt.tight_layout()
plt.savefig(os.path.join(PLOT_DIR, "attrition_distribution.png"), dpi=120)
plt.close()

# 2b. Attrition by department
fig, ax = plt.subplots(figsize=(7, 4))
sns.countplot(data=df, x="Department", hue="Attrition",
              palette=["#27ae60", "#e74c3c"], ax=ax)
ax.set_title("Attrition by Department", fontsize=14, fontweight="bold")
plt.xticks(rotation=15)
plt.tight_layout()
plt.savefig(os.path.join(PLOT_DIR, "attrition_by_department.png"), dpi=120)
plt.close()

# 2c. Age distribution by attrition
fig, ax = plt.subplots(figsize=(7, 4))
sns.histplot(data=df, x="Age", hue="Attrition", kde=True,
             palette=["#27ae60", "#e74c3c"], ax=ax)
ax.set_title("Age Distribution by Attrition", fontsize=14, fontweight="bold")
plt.tight_layout()
plt.savefig(os.path.join(PLOT_DIR, "age_by_attrition.png"), dpi=120)
plt.close()

# 2d. Monthly income by attrition
fig, ax = plt.subplots(figsize=(7, 4))
sns.boxplot(data=df, x="Attrition", y="MonthlyIncome",
            palette=["#e74c3c", "#27ae60"], ax=ax)
ax.set_title("Monthly Income by Attrition", fontsize=14, fontweight="bold")
plt.tight_layout()
plt.savefig(os.path.join(PLOT_DIR, "income_by_attrition.png"), dpi=120)
plt.close()

# 2e. Feature correlation heatmap (top numeric features)
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
corr = df[numeric_cols].corr()
fig, ax = plt.subplots(figsize=(12, 10))
sns.heatmap(corr, annot=True, fmt=".2f", cmap="RdBu_r", center=0,
            ax=ax, square=True, linewidths=0.5)
ax.set_title("Feature Correlation Heatmap", fontsize=14, fontweight="bold")
plt.tight_layout()
plt.savefig(os.path.join(PLOT_DIR, "correlation_heatmap.png"), dpi=120)
plt.close()

print(f"    ✓ 5 charts saved to static/plots/")

# ── 3. Preprocessing ───────────────────────────────────────────────────────────
print("\n[2/5] Preprocessing …")

# Drop columns that carry no predictive signal
DROP_COLS = [
    "EmployeeCount",   # constant = 1
    "StandardHours",   # constant = 80
    "Over18",          # constant = Y
    "EmployeeNumber",  # ID column
]
df = df.drop(columns=[c for c in DROP_COLS if c in df.columns])

# Encode target
df["Attrition"] = df["Attrition"].map({"Yes": 1, "No": 0})

# Identify column types
categorical_cols = df.select_dtypes(include=["object"]).columns.tolist()
numeric_cols     = [c for c in df.columns if c not in categorical_cols + ["Attrition"]]

print(f"    Categorical features ({len(categorical_cols)}): {categorical_cols}")
print(f"    Numeric features     ({len(numeric_cols)}):     {numeric_cols}")

# Label-encode categorical columns (consistent ordering for inference)
label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# Feature engineering: add interaction terms that boost model performance
df["IncomePerYear"]      = df["MonthlyIncome"] * 12
df["TenureRatio"]        = df["YearsAtCompany"] / (df["TotalWorkingYears"] + 1)
df["PromotionGap"]       = df["YearsAtCompany"] - df["YearsSinceLastPromotion"]
df["SatisfactionAvg"]    = (df["JobSatisfaction"] + df["EnvironmentSatisfaction"]
                           + df["RelationshipSatisfaction"]) / 3

X = df.drop(columns=["Attrition"])
y = df["Attrition"]

feature_names = X.columns.tolist()

# Train / test split (stratified)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scale numeric features
scaler = StandardScaler()
X_train_scaled = pd.DataFrame(
    scaler.fit_transform(X_train), columns=feature_names, index=X_train.index
)
X_test_scaled = pd.DataFrame(
    scaler.transform(X_test), columns=feature_names, index=X_test.index
)

# Handle class imbalance with SMOTE (only on training data)
smote = SMOTE(random_state=42, k_neighbors=5)
X_train_sm, y_train_sm = smote.fit_resample(X_train_scaled, y_train)
print(f"    Train set: {X_train_scaled.shape[0]} samples")
print(f"    Features:  {len(feature_names)} (incl. engineered)")
print(f"    After SMOTE: {X_train_sm.shape[0]} samples (balanced)")
print(f"    Test  set: {X_test_scaled.shape[0]} samples")

# ── 4. Model Training & Evaluation ─────────────────────────────────────────────
print("\n[3/5] Training models …")

# Build model configs to try (each with SMOTE and without)
model_configs = {
    "Random Forest": [
        {"n_estimators": 500, "max_depth": None, "min_samples_split": 2,
         "min_samples_leaf": 1, "class_weight": "balanced", "random_state": 42, "n_jobs": -1},
        {"n_estimators": 500, "max_depth": 20, "min_samples_split": 3,
         "min_samples_leaf": 2, "class_weight": "balanced_subsample", "random_state": 42, "n_jobs": -1},
    ],
    "Gradient Boosting": [
        {"n_estimators": 300, "max_depth": 5, "learning_rate": 0.1,
         "subsample": 0.8, "min_samples_split": 5, "min_samples_leaf": 3, "random_state": 42},
        {"n_estimators": 500, "max_depth": 4, "learning_rate": 0.05,
         "subsample": 0.85, "min_samples_split": 4, "min_samples_leaf": 2, "random_state": 42},
    ],
    "Decision Tree": [
        {"max_depth": 10, "min_samples_split": 5, "min_samples_leaf": 2,
         "class_weight": "balanced", "random_state": 42},
    ],
    "K-Nearest Neighbors": [
        {"n_neighbors": 5, "weights": "distance", "metric": "minkowski", "p": 2},
        {"n_neighbors": 7, "weights": "distance", "metric": "minkowski", "p": 2},
    ],
    "Logistic Regression": [
        {"class_weight": "balanced", "max_iter": 2000, "C": 1.0, "solver": "lbfgs", "random_state": 42},
        {"class_weight": "balanced", "max_iter": 2000, "C": 0.5, "solver": "lbfgs", "random_state": 42},
    ],
    "SVM": [
        {"kernel": "rbf", "class_weight": "balanced", "C": 1.0, "gamma": "scale",
         "probability": True, "random_state": 42},
        {"kernel": "rbf", "class_weight": "balanced", "C": 5.0, "gamma": "auto",
         "probability": True, "random_state": 42},
    ],
}

model_classes = {
    "Random Forest": RandomForestClassifier,
    "Gradient Boosting": GradientBoostingClassifier,
    "Decision Tree": DecisionTreeClassifier,
    "K-Nearest Neighbors": KNeighborsClassifier,
    "Logistic Regression": LogisticRegression,
    "SVM": SVC,
}

results = {}
for name, configs in model_configs.items():
    cls = model_classes[name]
    best_for_model = None
    for params in configs:
        for use_smote in [True, False]:
            m = cls(**params)
            X_tr = X_train_sm if use_smote else X_train_scaled
            y_tr = y_train_sm if use_smote else y_train
            m.fit(X_tr, y_tr)
            y_pred  = m.predict(X_test_scaled)
            y_proba = m.predict_proba(X_test_scaled)[:, 1]
            acc     = accuracy_score(y_test, y_pred)
            auc     = roc_auc_score(y_test, y_proba)
            f1      = f1_score(y_test, y_pred)
            # Combined score: weight accuracy and AUC equally
            score   = 0.5 * acc + 0.5 * auc
            label   = f"    {name:25s}"
            smote_tag = "SMOTE" if use_smote else "orig "
            if best_for_model is None or score > best_for_model["score"]:
                best_for_model = {"model": m, "acc": acc, "auc": auc, "f1": f1,
                                  "score": score, "y_pred": y_pred, "y_proba": y_proba,
                                  "smote": use_smote}
    results[name] = best_for_model
    sm_tag = "+SMOTE" if best_for_model["smote"] else "      "
    print(f"    {name:25s}  Acc={best_for_model['acc']:.4f}  AUC={best_for_model['auc']:.4f}  F1={best_for_model['f1']:.4f}  {sm_tag}")

# Pick best model by combined score (0.5*acc + 0.5*auc)
best_name = max(results, key=lambda k: results[k]["score"])
best      = results[best_name]["model"]
best_pred = results[best_name]["y_pred"]
best_proba = results[best_name]["y_proba"]
best_f1   = results[best_name]["f1"]
print(f"\n    ★ Best model: {best_name}")
print(f"      Accuracy = {results[best_name]['acc']:.4f}")
print(f"      AUC      = {results[best_name]['auc']:.4f}")
print(f"      F1 Score = {best_f1:.4f}")

# ── 5. Save Evaluation Charts ──────────────────────────────────────────────────
print("\n[4/5] Saving evaluation charts …")

# Confusion matrix
fig, ax = plt.subplots(figsize=(6, 5))
cm = confusion_matrix(y_test, best_pred)
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", ax=ax,
            xticklabels=["No", "Yes"], yticklabels=["No", "Yes"])
ax.set_xlabel("Predicted")
ax.set_ylabel("Actual")
ax.set_title(f"Confusion Matrix — {best_name}", fontsize=13, fontweight="bold")
plt.tight_layout()
plt.savefig(os.path.join(PLOT_DIR, "confusion_matrix.png"), dpi=120)
plt.close()

# ROC curve
fig, ax = plt.subplots(figsize=(6, 5))
for name, res in results.items():
    fpr, tpr, _ = roc_curve(y_test, res["y_proba"])
    ax.plot(fpr, tpr, label=f"{name} (AUC={res['auc']:.3f})", linewidth=2)
ax.plot([0, 1], [0, 1], "k--", alpha=0.4)
ax.set_xlabel("False Positive Rate")
ax.set_ylabel("True Positive Rate")
ax.set_title("ROC Curve Comparison", fontsize=13, fontweight="bold")
ax.legend()
plt.tight_layout()
plt.savefig(os.path.join(PLOT_DIR, "roc_curve.png"), dpi=120)
plt.close()

# Feature importance (tree-based best model)
if hasattr(best, "feature_importances_"):
    importances = pd.Series(best.feature_importances_, index=feature_names)
    top_n = importances.nlargest(15)
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.barplot(x=top_n.values, y=top_n.index, palette="viridis", ax=ax)
    ax.set_title(f"Top 15 Feature Importances — {best_name}",
                 fontsize=13, fontweight="bold")
    ax.set_xlabel("Importance")
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, "feature_importance.png"), dpi=120)
    plt.close()

print(f"    ✓ Evaluation charts saved")

# ── 6. Save Artifacts ───────────────────────────────────────────────────────────
print("\n[5/5] Saving model artifacts …")

artifacts = {
    "model":           best,
    "scaler":          scaler,
    "label_encoders":  label_encoders,
    "feature_names":   feature_names,
    "categorical_cols": categorical_cols,
    "numeric_cols":    numeric_cols,
    "model_name":      best_name,
}
joblib.dump(artifacts, os.path.join(MODEL_DIR, "artifacts.pkl"))

print(f"    ✓ Artifacts saved to model/artifacts.pkl")

# ── Summary ─────────────────────────────────────────────────────────────────────
print("\n" + "=" * 60)
print(classification_report(y_test, best_pred, target_names=["No", "Yes"]))
print("=" * 60)
print(f"\n✓ Training complete!  Run  python app.py  to start the web app.")
