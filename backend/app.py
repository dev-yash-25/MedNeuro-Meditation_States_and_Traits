from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import pickle
from typing import Dict, List, Tuple

import pandas as pd


app = Flask(__name__)
CORS(app)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "eeg_model.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "feature_columns.json")

SPECTRAL_FEATURES = ["theta_rel", "alpha_rel", "beta_rel", "gamma_rel"]
REQUIRED_FIELDS = SPECTRAL_FEATURES + ["channel"]
REGION_INSIGHTS = {
    "Occipital": {
        "brainwaves": ["Alpha", "Gamma"],
        "description": "Visual processing and sensory awareness",
        "state": "Deep awareness, open monitoring",
        "insight": "User is likely in a relaxed but highly aware state with strong sensory integration",
    },
    "Frontal": {
        "brainwaves": ["Beta", "Gamma"],
        "description": "Executive function and attention control",
        "state": "Focus, concentration",
        "insight": "User is likely engaged in active thinking and focused attention",
    },
    "Parietal": {
        "brainwaves": ["Gamma", "Theta"],
        "description": "Sensory integration and self-awareness",
        "state": "Heightened awareness, advanced meditative state",
        "insight": "User is likely experiencing strong internal and external awareness integration",
    },
    "Temporal": {
        "brainwaves": ["Theta", "Alpha"],
        "description": "Memory and emotional processing",
        "state": "Introspection, emotional awareness",
        "insight": "User is likely in a reflective and internally focused state",
    },
}


def load_artifacts() -> Tuple[object, List[str]]:
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
    if not os.path.exists(FEATURES_PATH):
        raise FileNotFoundError(f"Feature schema not found: {FEATURES_PATH}")

    with open(MODEL_PATH, "rb") as f:
        model_obj = pickle.load(f)
    with open(FEATURES_PATH, "r", encoding="utf-8") as f:
        feature_cols = json.load(f)

    return model_obj, feature_cols


model, feature_columns = load_artifacts()

# Keep inference single-threaded for stable runtime behavior on Windows/sandboxed environments.
if hasattr(model, "named_steps") and "rf" in model.named_steps:
    model.named_steps["rf"].set_params(n_jobs=1)


def validate_payload(payload: Dict) -> Tuple[bool, str]:
    if not isinstance(payload, dict):
        return False, "Payload must be a JSON object."

    missing = [field for field in REQUIRED_FIELDS if field not in payload]
    if missing:
        return False, f"Missing required fields: {', '.join(missing)}"

    channel = payload.get("channel")
    if not isinstance(channel, str) or not channel.strip():
        return False, "Field 'channel' must be a non-empty string."

    for key in SPECTRAL_FEATURES:
        try:
            float(payload.get(key))
        except (TypeError, ValueError):
            return False, f"Field '{key}' must be numeric."

    return True, ""


def build_feature_row(payload: Dict) -> pd.DataFrame:
    sample_df = pd.DataFrame([payload])
    sample_df["channel"] = sample_df["channel"].astype(str).str.strip()

    dummies = pd.get_dummies(sample_df["channel"], prefix="ch")
    x_sample = pd.concat([sample_df[SPECTRAL_FEATURES], dummies], axis=1)
    x_sample = x_sample.reindex(columns=feature_columns, fill_value=0)

    return x_sample


def predict_one(payload: Dict) -> Dict:
    x_sample = build_feature_row(payload)
    pred = model.predict(x_sample)[0]
    probs = model.predict_proba(x_sample)[0]

    class_probs = {
        cls: float(prob)
        for cls, prob in zip(model.classes_, probs)
    }

    return {
        "predicted_region": str(pred),
        "confidence": float(max(probs)),
        "class_probabilities": class_probs,
    }


def build_interpreted_output(predicted_region: str) -> Dict:
    details = REGION_INSIGHTS.get(
        predicted_region,
        {
            "brainwaves": [],
            "description": "No mapped interpretation available",
            "state": "Unknown",
            "insight": "No interpretation could be derived for this region",
        },
    )
    return {
        "region": predicted_region,
        "brainwaves": details["brainwaves"],
        "description": details["description"],
        "state": details["state"],
        "insight": details["insight"],
    }


@app.get("/")
def root():
    return jsonify(
        {
            "message": "MedNeuro EEG model backend is running.",
            "endpoints": ["/health", "/model/info", "/predict", "/predict/batch"],
        }
    )


@app.get("/health")
def health():
    return jsonify(
        {
            "status": "ok",
            "model_loaded": model is not None,
            "feature_count": len(feature_columns),
        }
    )


@app.get("/model/info")
def model_info():
    return jsonify(
        {
            "model_type": "RandomForest Pipeline",
            "spectral_features": SPECTRAL_FEATURES,
            "feature_count": len(feature_columns),
            "classes": list(map(str, getattr(model, "classes_", []))),
            "accepted_channels": sorted(
                [col.replace("ch_", "") for col in feature_columns if col.startswith("ch_")]
            ),
        }
    )


@app.post("/predict")
def predict():
    payload = request.get_json(silent=True)
    is_valid, error_msg = validate_payload(payload)
    if not is_valid:
        return jsonify({"error": error_msg}), 400

    try:
        result = predict_one(payload)
        interpreted = build_interpreted_output(result["predicted_region"])
        return jsonify({"input": payload, "prediction": interpreted})
    except Exception as exc:
        return jsonify({"error": f"Prediction failed: {str(exc)}"}), 500


@app.post("/predict/batch")
def predict_batch():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict) or "samples" not in payload:
        return jsonify({"error": "Payload must be an object containing 'samples' list."}), 400

    samples = payload["samples"]
    if not isinstance(samples, list) or len(samples) == 0:
        return jsonify({"error": "'samples' must be a non-empty list."}), 400

    results = []
    errors = []

    for i, sample in enumerate(samples):
        is_valid, error_msg = validate_payload(sample)
        if not is_valid:
            errors.append({"index": i, "error": error_msg})
            continue

        try:
            result = predict_one(sample)
            results.append(
                {
                    "index": i,
                    "input": sample,
                    "prediction": build_interpreted_output(result["predicted_region"]),
                }
            )
        except Exception as exc:
            errors.append({"index": i, "error": f"Prediction failed: {str(exc)}"})

    return jsonify(
        {
            "total_samples": len(samples),
            "successful_predictions": len(results),
            "failed_predictions": len(errors),
            "results": results,
            "errors": errors,
        }
    )


# if __name__ == "__main__":
#     app.run(debug=True)

#render
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
