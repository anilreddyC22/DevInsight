# Placeholder for file utility functions 

# devinsight/backend/utils/file_utils.py

import os
from pathlib import Path

# Define allowed and excluded file patterns
ALLOWED_EXTENSIONS = {
    '.py', '.java', '.js', '.ts', '.cpp', '.c', '.cs', '.go', '.rb',
    '.kt', '.rs', '.php', '.html', '.css', '.sh', '.bash'
}
EXCLUDED_DIRS = {
    'node_modules', 'venv', 'build', 'dist', 'out', '__pycache__', '.git',
    '.idea', '.vscode', '.mvn', 'test', 'tests', 'coverage', 'target', '.gradle'
}

def is_valid_code_file(path: Path) -> bool:
    """Check if a file is valid for analysis (based on extension and content)."""
    if not path.is_file():
        return False
    if any(part.lower() in EXCLUDED_DIRS for part in path.parts):
        return False
    if path.suffix.lower() not in ALLOWED_EXTENSIONS:
        return False
    try:
        with open(path, 'rb') as f:
            if not f.read(1024).isascii():
                return False
    except Exception:
        return False
    return True

def resolve_path(path: str) -> str:
    """Resolve absolute path."""
    return os.path.abspath(path)
