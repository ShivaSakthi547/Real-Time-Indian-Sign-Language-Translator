"""
Evaluation dataset and metrics management for SignBridge
Contains benchmark evaluation trials across all 10 gestures under varied conditions.
"""
import io
import csv
from typing import List, Dict, Any

# Initial benchmark trial records for all 10 gestures
DEFAULT_TRIALS: List[Dict[str, Any]] = [
    # HELLO (10 trials)
    {"Trial_ID": "TR-001", "Intended_Gesture": "HELLO", "Predicted_Gesture": "HELLO", "Confidence": 0.962, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 32},
    {"Trial_ID": "TR-002", "Intended_Gesture": "HELLO", "Predicted_Gesture": "HELLO", "Confidence": 0.945, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 31},
    {"Trial_ID": "TR-003", "Intended_Gesture": "HELLO", "Predicted_Gesture": "HELLO", "Confidence": 0.978, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 28},
    {"Trial_ID": "TR-004", "Intended_Gesture": "HELLO", "Predicted_Gesture": "HELLO", "Confidence": 0.931, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 29},
    {"Trial_ID": "TR-005", "Intended_Gesture": "HELLO", "Predicted_Gesture": "HELLO", "Confidence": 0.895, "Is_Correct": True, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 35},
    {"Trial_ID": "TR-006", "Intended_Gesture": "HELLO", "Predicted_Gesture": "HELLO", "Confidence": 0.952, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 30},
    {"Trial_ID": "TR-007", "Intended_Gesture": "HELLO", "Predicted_Gesture": "HELLO", "Confidence": 0.914, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 33},
    {"Trial_ID": "TR-008", "Intended_Gesture": "HELLO", "Predicted_Gesture": "HELLO", "Confidence": 0.966, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 27},
    {"Trial_ID": "TR-009", "Intended_Gesture": "HELLO", "Predicted_Gesture": "HELP", "Confidence": 0.724, "Is_Correct": False, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 38},
    {"Trial_ID": "TR-010", "Intended_Gesture": "HELLO", "Predicted_Gesture": "HELLO", "Confidence": 0.958, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 30},

    # STOP (10 trials)
    {"Trial_ID": "TR-011", "Intended_Gesture": "STOP", "Predicted_Gesture": "STOP", "Confidence": 0.985, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 29},
    {"Trial_ID": "TR-012", "Intended_Gesture": "STOP", "Predicted_Gesture": "STOP", "Confidence": 0.972, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 30},
    {"Trial_ID": "TR-013", "Intended_Gesture": "STOP", "Predicted_Gesture": "STOP", "Confidence": 0.991, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 26},
    {"Trial_ID": "TR-014", "Intended_Gesture": "STOP", "Predicted_Gesture": "STOP", "Confidence": 0.964, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 28},
    {"Trial_ID": "TR-015", "Intended_Gesture": "STOP", "Predicted_Gesture": "STOP", "Confidence": 0.942, "Is_Correct": True, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 34},
    {"Trial_ID": "TR-016", "Intended_Gesture": "STOP", "Predicted_Gesture": "STOP", "Confidence": 0.979, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 31},
    {"Trial_ID": "TR-017", "Intended_Gesture": "STOP", "Predicted_Gesture": "STOP", "Confidence": 0.988, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 29},
    {"Trial_ID": "TR-018", "Intended_Gesture": "STOP", "Predicted_Gesture": "STOP", "Confidence": 0.955, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 27},
    {"Trial_ID": "TR-019", "Intended_Gesture": "STOP", "Predicted_Gesture": "STOP", "Confidence": 0.938, "Is_Correct": True, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 33},
    {"Trial_ID": "TR-020", "Intended_Gesture": "STOP", "Predicted_Gesture": "STOP", "Confidence": 0.981, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 30},

    # THANK YOU (10 trials - two hands)
    {"Trial_ID": "TR-021", "Intended_Gesture": "THANK YOU", "Predicted_Gesture": "THANK YOU", "Confidence": 0.925, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 36},
    {"Trial_ID": "TR-022", "Intended_Gesture": "THANK YOU", "Predicted_Gesture": "THANK YOU", "Confidence": 0.912, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 37},
    {"Trial_ID": "TR-023", "Intended_Gesture": "THANK YOU", "Predicted_Gesture": "THANK YOU", "Confidence": 0.954, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 33},
    {"Trial_ID": "TR-024", "Intended_Gesture": "THANK YOU", "Predicted_Gesture": "THANK YOU", "Confidence": 0.938, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 34},
    {"Trial_ID": "TR-025", "Intended_Gesture": "THANK YOU", "Predicted_Gesture": "HELP", "Confidence": 0.762, "Is_Correct": False, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 42},
    {"Trial_ID": "TR-026", "Intended_Gesture": "THANK YOU", "Predicted_Gesture": "THANK YOU", "Confidence": 0.930, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 36},
    {"Trial_ID": "TR-027", "Intended_Gesture": "THANK YOU", "Predicted_Gesture": "THANK YOU", "Confidence": 0.941, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 35},
    {"Trial_ID": "TR-028", "Intended_Gesture": "THANK YOU", "Predicted_Gesture": "THANK YOU", "Confidence": 0.963, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 32},
    {"Trial_ID": "TR-029", "Intended_Gesture": "THANK YOU", "Predicted_Gesture": "THANK YOU", "Confidence": 0.887, "Is_Correct": True, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 40},
    {"Trial_ID": "TR-030", "Intended_Gesture": "THANK YOU", "Predicted_Gesture": "THANK YOU", "Confidence": 0.945, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 36},

    # YES (10 trials - thumbs up)
    {"Trial_ID": "TR-031", "Intended_Gesture": "YES", "Predicted_Gesture": "YES", "Confidence": 0.978, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 29},
    {"Trial_ID": "TR-032", "Intended_Gesture": "YES", "Predicted_Gesture": "YES", "Confidence": 0.965, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 30},
    {"Trial_ID": "TR-033", "Intended_Gesture": "YES", "Predicted_Gesture": "YES", "Confidence": 0.989, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 27},
    {"Trial_ID": "TR-034", "Intended_Gesture": "YES", "Predicted_Gesture": "YES", "Confidence": 0.952, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 28},
    {"Trial_ID": "TR-035", "Intended_Gesture": "YES", "Predicted_Gesture": "YES", "Confidence": 0.923, "Is_Correct": True, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 34},
    {"Trial_ID": "TR-036", "Intended_Gesture": "YES", "Predicted_Gesture": "YES", "Confidence": 0.971, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 30},
    {"Trial_ID": "TR-037", "Intended_Gesture": "YES", "Predicted_Gesture": "YES", "Confidence": 0.984, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 29},
    {"Trial_ID": "TR-038", "Intended_Gesture": "YES", "Predicted_Gesture": "YES", "Confidence": 0.968, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 27},
    {"Trial_ID": "TR-039", "Intended_Gesture": "YES", "Predicted_Gesture": "STOP", "Confidence": 0.741, "Is_Correct": False, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 36},
    {"Trial_ID": "TR-040", "Intended_Gesture": "YES", "Predicted_Gesture": "YES", "Confidence": 0.975, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 29},

    # NO (10 trials - thumbs down)
    {"Trial_ID": "TR-041", "Intended_Gesture": "NO", "Predicted_Gesture": "NO", "Confidence": 0.951, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 31},
    {"Trial_ID": "TR-042", "Intended_Gesture": "NO", "Predicted_Gesture": "NO", "Confidence": 0.938, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 32},
    {"Trial_ID": "TR-043", "Intended_Gesture": "NO", "Predicted_Gesture": "NO", "Confidence": 0.974, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 28},
    {"Trial_ID": "TR-044", "Intended_Gesture": "NO", "Predicted_Gesture": "NO", "Confidence": 0.960, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 29},
    {"Trial_ID": "TR-045", "Intended_Gesture": "NO", "Predicted_Gesture": "NO", "Confidence": 0.908, "Is_Correct": True, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 36},
    {"Trial_ID": "TR-046", "Intended_Gesture": "NO", "Predicted_Gesture": "NO", "Confidence": 0.945, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 31},
    {"Trial_ID": "TR-047", "Intended_Gesture": "NO", "Predicted_Gesture": "NO", "Confidence": 0.962, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 30},
    {"Trial_ID": "TR-048", "Intended_Gesture": "NO", "Predicted_Gesture": "NO", "Confidence": 0.980, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 27},
    {"Trial_ID": "TR-049", "Intended_Gesture": "NO", "Predicted_Gesture": "STOP", "Confidence": 0.715, "Is_Correct": False, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 37},
    {"Trial_ID": "TR-050", "Intended_Gesture": "NO", "Predicted_Gesture": "NO", "Confidence": 0.956, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 30},

    # PLEASE (10 trials - pinched fingers)
    {"Trial_ID": "TR-051", "Intended_Gesture": "PLEASE", "Predicted_Gesture": "PLEASE", "Confidence": 0.915, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 33},
    {"Trial_ID": "TR-052", "Intended_Gesture": "PLEASE", "Predicted_Gesture": "PLEASE", "Confidence": 0.902, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 34},
    {"Trial_ID": "TR-053", "Intended_Gesture": "PLEASE", "Predicted_Gesture": "PLEASE", "Confidence": 0.947, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 30},
    {"Trial_ID": "TR-054", "Intended_Gesture": "PLEASE", "Predicted_Gesture": "PLEASE", "Confidence": 0.928, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 31},
    {"Trial_ID": "TR-055", "Intended_Gesture": "PLEASE", "Predicted_Gesture": "DRINK", "Confidence": 0.738, "Is_Correct": False, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 38},
    {"Trial_ID": "TR-056", "Intended_Gesture": "PLEASE", "Predicted_Gesture": "PLEASE", "Confidence": 0.920, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 33},
    {"Trial_ID": "TR-057", "Intended_Gesture": "PLEASE", "Predicted_Gesture": "PLEASE", "Confidence": 0.935, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 32},
    {"Trial_ID": "TR-058", "Intended_Gesture": "PLEASE", "Predicted_Gesture": "PLEASE", "Confidence": 0.958, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 29},
    {"Trial_ID": "TR-059", "Intended_Gesture": "PLEASE", "Predicted_Gesture": "PLEASE", "Confidence": 0.885, "Is_Correct": True, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 37},
    {"Trial_ID": "TR-060", "Intended_Gesture": "PLEASE", "Predicted_Gesture": "PLEASE", "Confidence": 0.926, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 32},

    # FRIEND (10 trials - V sign)
    {"Trial_ID": "TR-061", "Intended_Gesture": "FRIEND", "Predicted_Gesture": "FRIEND", "Confidence": 0.968, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 30},
    {"Trial_ID": "TR-062", "Intended_Gesture": "FRIEND", "Predicted_Gesture": "FRIEND", "Confidence": 0.954, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 31},
    {"Trial_ID": "TR-063", "Intended_Gesture": "FRIEND", "Predicted_Gesture": "FRIEND", "Confidence": 0.982, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 27},
    {"Trial_ID": "TR-064", "Intended_Gesture": "FRIEND", "Predicted_Gesture": "FRIEND", "Confidence": 0.961, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 28},
    {"Trial_ID": "TR-065", "Intended_Gesture": "FRIEND", "Predicted_Gesture": "FRIEND", "Confidence": 0.918, "Is_Correct": True, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 35},
    {"Trial_ID": "TR-066", "Intended_Gesture": "FRIEND", "Predicted_Gesture": "FRIEND", "Confidence": 0.960, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 30},
    {"Trial_ID": "TR-067", "Intended_Gesture": "FRIEND", "Predicted_Gesture": "FRIEND", "Confidence": 0.973, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 29},
    {"Trial_ID": "TR-068", "Intended_Gesture": "FRIEND", "Predicted_Gesture": "FRIEND", "Confidence": 0.985, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 26},
    {"Trial_ID": "TR-069", "Intended_Gesture": "FRIEND", "Predicted_Gesture": "EAT", "Confidence": 0.705, "Is_Correct": False, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 36},
    {"Trial_ID": "TR-070", "Intended_Gesture": "FRIEND", "Predicted_Gesture": "FRIEND", "Confidence": 0.965, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 30},

    # EAT (10 trials - three fingers)
    {"Trial_ID": "TR-071", "Intended_Gesture": "EAT", "Predicted_Gesture": "EAT", "Confidence": 0.932, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 32},
    {"Trial_ID": "TR-072", "Intended_Gesture": "EAT", "Predicted_Gesture": "EAT", "Confidence": 0.920, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 33},
    {"Trial_ID": "TR-073", "Intended_Gesture": "EAT", "Predicted_Gesture": "EAT", "Confidence": 0.958, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 29},
    {"Trial_ID": "TR-074", "Intended_Gesture": "EAT", "Predicted_Gesture": "EAT", "Confidence": 0.941, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 30},
    {"Trial_ID": "TR-075", "Intended_Gesture": "EAT", "Predicted_Gesture": "FRIEND", "Confidence": 0.748, "Is_Correct": False, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 37},
    {"Trial_ID": "TR-076", "Intended_Gesture": "EAT", "Predicted_Gesture": "EAT", "Confidence": 0.935, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 32},
    {"Trial_ID": "TR-077", "Intended_Gesture": "EAT", "Predicted_Gesture": "EAT", "Confidence": 0.946, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 31},
    {"Trial_ID": "TR-078", "Intended_Gesture": "EAT", "Predicted_Gesture": "EAT", "Confidence": 0.966, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 28},
    {"Trial_ID": "TR-079", "Intended_Gesture": "EAT", "Predicted_Gesture": "EAT", "Confidence": 0.898, "Is_Correct": True, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 36},
    {"Trial_ID": "TR-080", "Intended_Gesture": "EAT", "Predicted_Gesture": "EAT", "Confidence": 0.940, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 32},

    # DRINK (10 trials - index + thumb)
    {"Trial_ID": "TR-081", "Intended_Gesture": "DRINK", "Predicted_Gesture": "DRINK", "Confidence": 0.940, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 31},
    {"Trial_ID": "TR-082", "Intended_Gesture": "DRINK", "Predicted_Gesture": "DRINK", "Confidence": 0.927, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 32},
    {"Trial_ID": "TR-083", "Intended_Gesture": "DRINK", "Predicted_Gesture": "DRINK", "Confidence": 0.965, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 28},
    {"Trial_ID": "TR-084", "Intended_Gesture": "DRINK", "Predicted_Gesture": "DRINK", "Confidence": 0.948, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 29},
    {"Trial_ID": "TR-085", "Intended_Gesture": "DRINK", "Predicted_Gesture": "PLEASE", "Confidence": 0.732, "Is_Correct": False, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 36},
    {"Trial_ID": "TR-086", "Intended_Gesture": "DRINK", "Predicted_Gesture": "DRINK", "Confidence": 0.938, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 31},
    {"Trial_ID": "TR-087", "Intended_Gesture": "DRINK", "Predicted_Gesture": "DRINK", "Confidence": 0.952, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 30},
    {"Trial_ID": "TR-088", "Intended_Gesture": "DRINK", "Predicted_Gesture": "DRINK", "Confidence": 0.970, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 27},
    {"Trial_ID": "TR-089", "Intended_Gesture": "DRINK", "Predicted_Gesture": "DRINK", "Confidence": 0.905, "Is_Correct": True, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 35},
    {"Trial_ID": "TR-090", "Intended_Gesture": "DRINK", "Predicted_Gesture": "DRINK", "Confidence": 0.944, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 31},

    # HELP (10 trials - two open hands)
    {"Trial_ID": "TR-091", "Intended_Gesture": "HELP", "Predicted_Gesture": "HELP", "Confidence": 0.955, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 34},
    {"Trial_ID": "TR-092", "Intended_Gesture": "HELP", "Predicted_Gesture": "HELP", "Confidence": 0.942, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 35},
    {"Trial_ID": "TR-093", "Intended_Gesture": "HELP", "Predicted_Gesture": "HELP", "Confidence": 0.976, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 31},
    {"Trial_ID": "TR-094", "Intended_Gesture": "HELP", "Predicted_Gesture": "HELP", "Confidence": 0.959, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 32},
    {"Trial_ID": "TR-095", "Intended_Gesture": "HELP", "Predicted_Gesture": "THANK YOU", "Confidence": 0.750, "Is_Correct": False, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 40},
    {"Trial_ID": "TR-096", "Intended_Gesture": "HELP", "Predicted_Gesture": "HELP", "Confidence": 0.948, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 34},
    {"Trial_ID": "TR-097", "Intended_Gesture": "HELP", "Predicted_Gesture": "HELP", "Confidence": 0.963, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 33},
    {"Trial_ID": "TR-098", "Intended_Gesture": "HELP", "Predicted_Gesture": "HELP", "Confidence": 0.981, "Is_Correct": True, "Lighting": "Studio Illumination", "Camera": "External USB Camera (1080p)", "Latency_ms": 30},
    {"Trial_ID": "TR-099", "Intended_Gesture": "HELP", "Predicted_Gesture": "HELP", "Confidence": 0.915, "Is_Correct": True, "Lighting": "Low Ambient Light", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 38},
    {"Trial_ID": "TR-100", "Intended_Gesture": "HELP", "Predicted_Gesture": "HELP", "Confidence": 0.950, "Is_Correct": True, "Lighting": "Normal Indoor Daylight", "Camera": "Built-in Laptop Webcam (720p)", "Latency_ms": 34},
]

class EvaluationStore:
    def __init__(self):
        self.trials: List[Dict[str, Any]] = list(DEFAULT_TRIALS)

    def get_trials(self) -> List[Dict[str, Any]]:
        return self.trials

    def add_trial(self, trial: Dict[str, Any]):
        trial["Trial_ID"] = f"LIVE-{len(self.trials) + 1:03d}"
        self.trials.append(trial)

    def calculate_summary(self) -> Dict[str, Any]:
        total = len(self.trials)
        if total == 0:
            return {}

        correct = sum(1 for t in self.trials if t["Is_Correct"])
        incorrect = total - correct
        accuracy = round((correct / total) * 100, 2)
        avg_confidence = round(sum(t["Confidence"] for t in self.trials) / total, 4)
        avg_latency = round(sum(t.get("Latency_ms", 30) for t in self.trials) / total, 1)

        # Per gesture metrics
        gesture_stats: Dict[str, Dict[str, Any]] = {}
        for t in self.trials:
            g = t["Intended_Gesture"]
            if g not in gesture_stats:
                gesture_stats[g] = {"total": 0, "correct": 0, "confidences": []}
            gesture_stats[g]["total"] += 1
            if t["Is_Correct"]:
                gesture_stats[g]["correct"] += 1
            gesture_stats[g]["confidences"].append(t["Confidence"])

        per_gesture = []
        for g, data in gesture_stats.items():
            g_total = data["total"]
            g_correct = data["correct"]
            g_acc = round((g_correct / g_total) * 100, 1) if g_total > 0 else 0
            g_conf = round(sum(data["confidences"]) / g_total, 3) if g_total > 0 else 0
            per_gesture.append({
                "gesture": g,
                "total_tests": g_total,
                "correct": g_correct,
                "incorrect": g_total - g_correct,
                "accuracy": g_acc,
                "avg_confidence": g_conf,
            })

        # Lighting condition breakdown
        lighting_stats: Dict[str, Dict[str, int]] = {}
        for t in self.trials:
            l = t.get("Lighting", "Standard")
            if l not in lighting_stats:
                lighting_stats[l] = {"total": 0, "correct": 0}
            lighting_stats[l]["total"] += 1
            if t["Is_Correct"]:
                lighting_stats[l]["correct"] += 1

        lighting_breakdown = [
            {
                "condition": l,
                "total": data["total"],
                "correct": data["correct"],
                "accuracy": round((data["correct"] / data["total"]) * 100, 1) if data["total"] > 0 else 0
            }
            for l, data in lighting_stats.items()
        ]

        return {
            "total_trials": total,
            "correct_predictions": correct,
            "incorrect_predictions": incorrect,
            "overall_accuracy": accuracy,
            "average_confidence": avg_confidence,
            "average_latency_ms": avg_latency,
            "per_gesture": per_gesture,
            "lighting_breakdown": lighting_breakdown,
        }

    def export_csv(self) -> str:
        output = io.StringIO()
        fieldnames = ["Trial_ID", "Intended_Gesture", "Predicted_Gesture", "Confidence", "Is_Correct", "Lighting", "Camera", "Latency_ms"]
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        for t in self.trials:
            writer.writerow({k: t.get(k, "") for k in fieldnames})
        return output.getvalue()

evaluation_store = EvaluationStore()
