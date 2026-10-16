"""
SignBridge Launch Script
Starts the FastAPI Python backend and the React Vite frontend concurrently.
"""
import os
import sys
import subprocess
import time
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(ROOT, "frontend")
BACKEND_DIR = os.path.join(ROOT, "backend")


def get_python_exe():
    # Priority for Python 3.11 with MediaPipe
    candidates = [
        os.path.expandvars(r"%LOCALAPPDATA%\Programs\Python\Python311\python.exe"),
        r"C:\Program Files\Python311\python.exe",
        r"C:\Python311\python.exe",
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    return sys.executable


def main():
    py_bin = get_python_exe()

    print("=" * 65)
    print("  🤟 SignBridge — AI-Powered Sign Language Communication Assistant")
    print("=" * 65)
    print(f"[*] Python Interpreter : {py_bin}")
    print(f"[*] Backend Directory  : {BACKEND_DIR}")
    print(f"[*] Frontend Directory : {FRONTEND_DIR}")
    print("=" * 65)

    # 1. Start FastAPI Backend Server on port 8000
    print("\n[1/2] Starting FastAPI Recognition Engine on http://localhost:8000 ...")
    backend_cmd = [
        py_bin, "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--reload"
    ]
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=BACKEND_DIR
    )

    # Allow backend 1.5s to bind port
    time.sleep(1.5)

    # 2. Start Vite Dev Server on port 5173
    print("[2/2] Starting React Vite Frontend on http://localhost:5173 ...")
    frontend_proc = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=FRONTEND_DIR,
        shell=True
    )

    time.sleep(2)
    frontend_url = "http://localhost:5173"
    print(f"\n[+] Opening browser at {frontend_url} ...")
    try:
        webbrowser.open(frontend_url)
    except Exception:
        pass

    print("\n" + "=" * 65)
    print("  SignBridge is running!")
    print("  • Frontend UI  : http://localhost:5173")
    print("  • Backend Docs : http://localhost:8000/docs")
    print("  Press Ctrl+C in this terminal to stop both servers.")
    print("=" * 65 + "\n")

    try:
        backend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping SignBridge servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Servers stopped.")


if __name__ == "__main__":
    main()
