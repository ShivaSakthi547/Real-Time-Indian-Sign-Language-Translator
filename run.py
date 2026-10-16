import os
import subprocess
import sys

def get_python_exe():
    try:
        import mediapipe as mp
        if hasattr(mp, "solutions") and hasattr(mp.solutions, "hands"):
            return sys.executable
    except Exception:
        pass

    try:
        res = subprocess.run(
            ["py", "-3.11", "-c", "import sys; print(sys.executable)"],
            capture_output=True,
            text=True,
            timeout=5
        )
        if res.returncode == 0 and os.path.exists(res.stdout.strip()):
            return res.stdout.strip()
    except Exception:
        pass

    candidates = [
        os.path.expandvars(r"%LOCALAPPDATA%\Programs\Python\Python311\python.exe"),
        r"C:\Program Files\Python311\python.exe",
        r"C:\Python311\python.exe",
    ]
    for path in candidates:
        if os.path.exists(path):
            return path

    return sys.executable

def main():
    root = os.path.dirname(os.path.abspath(__file__))
    nested = os.path.join(root, "real-time-sign-language-translator-main")
    python_bin = get_python_exe()

    if os.path.exists(nested):
        src_path = os.path.join(nested, "src")
    else:
        src_path = os.path.join(root, "src")

    os.chdir(src_path)
    return subprocess.run([python_bin, "main.py"]).returncode

if __name__ == "__main__":
    sys.exit(main())
