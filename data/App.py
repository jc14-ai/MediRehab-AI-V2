from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.optimizers import Adam
import json
import os

app = Flask(__name__)
CORS(app)

# -------------------------
# Config for exercises
# -------------------------
BASE_MODEL_DIR = "model"
BASE_KEYORDER_DIR = os.path.join(BASE_MODEL_DIR, "key_order")
LANDMARKS_DIR = "landmarks"
TRAINING_DIR = "training_data"

EXERCISES = {
    "calf_raise": {
        "parts": ["LEFT_KNEE", "RIGHT_KNEE", "LEFT_ANKLE", "RIGHT_ANKLE", "LEFT_HEEL", "RIGHT_HEEL"],
        "anchor": "LEFT_KNEE",
        "center_keys": ["LEFT_KNEE", "RIGHT_KNEE", "LEFT_ANKLE", "RIGHT_ANKLE"],
        "train_csv": os.path.join(TRAINING_DIR, "calf_raise_hold_landmarks.csv"),
        "test_csv": os.path.join(LANDMARKS_DIR, "calf_raise_landmarks_test.csv"),
        "model_path": os.path.join(BASE_MODEL_DIR, "calf_raise_model.keras"),
        "key_order_path": os.path.join(BASE_KEYORDER_DIR, "calf_raise_key_order.json"),
    },
    "chest_squeeze": {
        "parts": ["LEFT_SHOULDER","RIGHT_SHOULDER","LEFT_ELBOW","RIGHT_ELBOW","LEFT_WRIST","RIGHT_WRIST","LEFT_HIP","RIGHT_HIP"],
        "anchor": "LEFT_SHOULDER",
        "center_keys": ["LEFT_SHOULDER", "RIGHT_SHOULDER", "LEFT_WRIST", "RIGHT_WRIST", "LEFT_HIP", "RIGHT_HIP"],
        "train_csv": os.path.join(TRAINING_DIR, "chest_squeeze_hold_landmarks.csv"),
        "test_csv": os.path.join(LANDMARKS_DIR, "chest_squeeze_landmarks_test.csv"),
        "model_path": os.path.join(BASE_MODEL_DIR, "chest_squeeze_model.keras"),
        "key_order_path": os.path.join(BASE_KEYORDER_DIR, "chest_squeeze_key_order.json"),
    },
    "front_arms_raise": {
        "parts": ["LEFT_SHOULDER","RIGHT_SHOULDER","LEFT_ELBOW","RIGHT_ELBOW","LEFT_HIP","RIGHT_HIP"],
        "anchor": "LEFT_SHOULDER",
        "center_keys": ["LEFT_SHOULDER","RIGHT_SHOULDER","LEFT_HIP","RIGHT_HIP"],
        "train_csv": os.path.join(TRAINING_DIR, "front_arms_raise_landmarks.csv"),
        "test_csv": os.path.join(LANDMARKS_DIR, "front_arms_raise_landmarks_test.csv"),
        "model_path": os.path.join(BASE_MODEL_DIR, "front_arms_raise_model.keras"),
        "key_order_path": os.path.join(BASE_KEYORDER_DIR, "front_arms_raise_key_order.json"),
    },
    "side_arms_raise": {
        "parts": ["LEFT_SHOULDER","RIGHT_SHOULDER","LEFT_ELBOW","RIGHT_ELBOW","LEFT_HIP","RIGHT_HIP"],
        "anchor": "LEFT_SHOULDER",
        "center_keys": ["LEFT_SHOULDER","RIGHT_SHOULDER","LEFT_HIP","RIGHT_HIP"],
        "train_csv": os.path.join(TRAINING_DIR, "side_arms_raise_landmarks.csv"),
        "test_csv": os.path.join(LANDMARKS_DIR, "side_arms_raise_landmarks_test.csv"),
        "model_path": os.path.join(BASE_MODEL_DIR, "side_arms_raise_model.keras"),
        "key_order_path": os.path.join(BASE_KEYORDER_DIR, "side_arms_raise_key_order.json"),
    },
    "squat": {
        "parts": ["LEFT_SHOULDER","RIGHT_SHOULDER","LEFT_HIP","RIGHT_HIP","LEFT_KNEE","RIGHT_KNEE"],
        "anchor": "LEFT_SHOULDER",
        "center_keys": ["LEFT_HIP","RIGHT_HIP","LEFT_KNEE","RIGHT_KNEE"],
        "train_csv": os.path.join(TRAINING_DIR, "squat_hold_landmarks.csv"),
        "test_csv": os.path.join(LANDMARKS_DIR, "squat_landmarks_test.csv"),
        "model_path": os.path.join(BASE_MODEL_DIR, "squat_model.keras"),
        "key_order_path": os.path.join(BASE_KEYORDER_DIR, "squat_key_order.json"),
    },
    "wall_sit": {
        "parts": ["LEFT_SHOULDER","RIGHT_SHOULDER","LEFT_ELBOW","RIGHT_ELBOW","LEFT_HIP","RIGHT_HIP","LEFT_KNEE","RIGHT_KNEE","LEFT_ANKLE","RIGHT_ANKLE"],
        "anchor": "LEFT_SHOULDER",
        "center_keys": ["LEFT_HIP","RIGHT_HIP","LEFT_KNEE","RIGHT_KNEE"],
        "train_csv": os.path.join(TRAINING_DIR, "wall_sit_arm_hold_landmarks.csv"),
        "test_csv": os.path.join(LANDMARKS_DIR, "wall_sit_landmarks_test.csv"),
        "model_path": os.path.join(BASE_MODEL_DIR, "wall_sit_model.keras"),
        "key_order_path": os.path.join(BASE_KEYORDER_DIR, "wall_sit_key_order.json"),
    },
}

# ensure dirs
os.makedirs(BASE_MODEL_DIR, exist_ok=True)
os.makedirs(BASE_KEYORDER_DIR, exist_ok=True)
os.makedirs(LANDMARKS_DIR, exist_ok=True)
os.makedirs(TRAINING_DIR, exist_ok=True)

# -------------------------
# Helpers
# -------------------------
def load_raw_pose(df):
    """
    df is a DataFrame containing rows for one frame (parts,x_coords,y_coords,z_coords,labels optional)
    returns dict like {"LEFT_SHOULDER_x":..., "LEFT_SHOULDER_y":..., ...}
    """
    landmarks = {}
    for _, row in df.iterrows():
        part = row["parts"]
        landmarks[f"{part}_x"] = row["x_coords"]
        landmarks[f"{part}_y"] = row["y_coords"]
        landmarks[f"{part}_z"] = row["z_coords"]
    return landmarks

def load_frames_from_csv(df, anchor):
    """
    Generic loader: groups consecutive rows into frames by detecting anchor landmark as start of new frame.
    """
    frames = []
    current_frame_rows = []

    for _, row in df.iterrows():
        part = row["parts"]
        # When we see anchor and current buffer not empty -> start new frame
        if part == anchor and len(current_frame_rows) > 0:
            frames.append(load_raw_pose(pd.DataFrame(current_frame_rows)))
            current_frame_rows = []
        current_frame_rows.append(row)
    # last frame
    if len(current_frame_rows) > 0:
        frames.append(load_raw_pose(pd.DataFrame(current_frame_rows)))
    return frames

def normalize_frame(frame, center_keys):
    """
    Center and scale according to provided center_keys list.
    center_keys is a list of landmark names (without _x/_y/_z).
    """
    pose = frame.copy()

    # find first available center key
    center_point = None
    for key in center_keys:
        if f"{key}_x" in pose:
            center_point = np.array([
                pose[f"{key}_x"],
                pose[f"{key}_y"],
                pose[f"{key}_z"]
            ])
            break

    # fallback to first available landmark
    if center_point is None:
        first = list(pose.keys())[0].rsplit("_", 1)[0]
        center_point = np.array([
            pose[f"{first}_x"],
            pose[f"{first}_y"],
            pose[f"{first}_z"]
        ])

    # center
    for k in list(pose.keys()):
        axis = k.split("_")[-1]
        pose[k] = pose[k] - center_point["xyz".index(axis)]

    # scale: try shoulder distance, else hip distance, else 1
    scale = 1.0
    if "LEFT_SHOULDER_x" in pose and "RIGHT_SHOULDER_x" in pose:
        ls = np.array([pose["LEFT_SHOULDER_x"], pose["LEFT_SHOULDER_y"], pose["LEFT_SHOULDER_z"]])
        rs = np.array([pose["RIGHT_SHOULDER_x"], pose["RIGHT_SHOULDER_y"], pose["RIGHT_SHOULDER_z"]])
        scale = np.linalg.norm(ls - rs) or 1.0
    else:
        # try hips
        if "LEFT_HIP_x" in pose and "RIGHT_HIP_x" in pose:
            lh = np.array([pose["LEFT_HIP_x"], pose["LEFT_HIP_y"], pose["LEFT_HIP_z"]])
            rh = np.array([pose["RIGHT_HIP_x"], pose["RIGHT_HIP_y"], pose["RIGHT_HIP_z"]])
            scale = np.linalg.norm(lh - rh) or 1.0

    if scale == 0:
        scale = 1.0

    for k in pose:
        pose[k] = pose[k] / scale

    return pose

def pose_to_vector(pose_dict, order_keys):
    vec = []
    for key in order_keys:
        vec.append(pose_dict.get(key, 0.0))
    return np.array(vec, dtype=float)

def build_lstm_autoencoder(input_dim):
    model = Sequential([
        LSTM(64, return_sequences=False, input_shape=(1, input_dim)),
        Dense(64, activation='relu'),
        Dense(input_dim)
    ])
    model.compile(optimizer=Adam(0.001), loss='mse')
    return model

# -------------------------
# Training / prediction helpers
# -------------------------
def prepare_dataset(frames, all_keys, center_keys):
    X = []
    for pose in frames:
        pose_norm = normalize_frame(pose, center_keys)
        vec = pose_to_vector(pose_norm, all_keys)
        X.append(vec.reshape(1, -1))
    X = np.array(X)
    return X  # shape (n_frames, 1, input_dim)

def train_exercise(ex_name):
    cfg = EXERCISES[ex_name]
    df = pd.read_csv(cfg["train_csv"])
    frames = load_frames_from_csv(df, cfg["anchor"])
    if len(frames) == 0:
        raise ValueError("No frames found for training. Check CSV and anchor.")

    # collect all unique keys across frames to build stable vector order
    all_keys = sorted({k for f in frames for k in f.keys()})
    X = prepare_dataset(frames, all_keys, cfg["center_keys"])

    model = build_lstm_autoencoder(input_dim=X.shape[2])
    model.fit(X, X, epochs=40, batch_size=8)

    # save
    model.save(cfg["model_path"])
    with open(cfg["key_order_path"], "w") as f:
        json.dump(all_keys, f)
    return True

def evaluate_exercise(ex_name):
    cfg = EXERCISES[ex_name]
    # load model & keys
    if not os.path.exists(cfg["model_path"]) or not os.path.exists(cfg["key_order_path"]):
        raise FileNotFoundError("Model or key order not found for exercise: " + ex_name)

    model = load_model(cfg["model_path"])
    with open(cfg["key_order_path"], "r") as f:
        key_order = json.load(f)

    df_test = pd.read_csv(cfg["test_csv"], header=None, names=['parts','x_coords','y_coords','z_coords','labels'])
    user_frames = load_frames_from_csv(df_test, cfg["anchor"])

    accuracies = []
    for pose_dict in user_frames:
        pose_norm = normalize_frame(pose_dict, cfg["center_keys"])
        vec = pose_to_vector(pose_norm, key_order)
        X = vec.reshape(1, 1, -1)
        pred_vec = model.predict(X)[0]
        mse = np.mean((vec - pred_vec) ** 2)
        accuracies.append(1 - min(1, mse))
    final_acc = float(np.mean(accuracies)) if len(accuracies) > 0 else 0.0
    return final_acc

# -------------------------
# Flask routes
# -------------------------
def train(ex_name):
    try:
        train_exercise(ex_name)
    except Exception as e:
        print("not working")

@app.route("/evaluate/<ex_name>", methods=["GET"])
def route_evaluate(ex_name):
    if ex_name not in EXERCISES:
        return jsonify({"error": "unknown exercise"}), 404
    try:
        acc = evaluate_exercise(ex_name)
        return jsonify({"accuracy": acc, "exercise": ex_name})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Simple record endpoint (append rows). Expects frame = list of dicts
@app.route("/record/<ex_name>", methods=['POST'])
def record_frame(ex_name):
    data = request.get_json()
    frame = data.get("frame")
    target_csv = data.get("csv_path", os.path.join(LANDMARKS_DIR, f"{ex_name}_landmarks.csv"))
    if not frame or not isinstance(frame, list):
        return jsonify({"error": "frame missing or invalid"}), 400

    df = pd.DataFrame(frame)
    # If file exists append without header; else create with header
    # write_header = not os.path.exists(target_csv)
    df.to_csv(target_csv, mode="a", header=False, index=False)
    return jsonify({"status": "ok", "rows": len(df)})

# simple route that lists exercises
@app.route("/exercises", methods=["GET"])
def list_exercises():
    return jsonify(list(EXERCISES.keys()))

if __name__ == "__main__":
    app.run(debug=True)
