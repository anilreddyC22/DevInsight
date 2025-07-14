# devinsight/backend/services/complexity_analyzer.py

import lizard
from pathlib import Path
from utils.file_utils import is_valid_code_file
from config.constants import MAX_COMPLEXITY_FILES
from typing import Optional

def get_complexity(repo_path, page=1, limit=100, allowed_exts: Optional[set] = None):
    repo_path = Path(repo_path)
    complexity_data = []

    # Traverse all files under the repo directory
    for path in repo_path.rglob("*"):
        # Skip non-file paths or binary/excluded/unsupported files
        if not is_valid_code_file(path):
            continue

        # If user provided extension filters, apply them
        if allowed_exts and path.suffix.lower() not in allowed_exts:
            continue

        try:
            # Analyze the file using lizard for code metrics
            result = lizard.analyze_file(str(path))

            # Calculate average cyclomatic complexity
            avg_complexity = (
                sum(func.cyclomatic_complexity for func in result.function_list) / len(result.function_list)
                if result.function_list else 0
            )

            # Get total non-comment lines of code (nloc)
            total_lines = result.nloc

            # Get total number of functions/methods
            num_functions = len(result.function_list)

            # Compute complexity per line (guard against divide by zero)
            complexity_per_line = round(avg_complexity / total_lines, 4) if total_lines > 0 else 0

            # Get relative path (normalized with forward slashes, lowercase)
            rel_path = path.relative_to(repo_path).as_posix().lower()

            # Append computed metrics to the result list
            complexity_data.append({
                "file": rel_path,
                "complexity": round(avg_complexity, 2),
                "lines": total_lines,
                "functions": num_functions,
                "complexity_per_line": complexity_per_line
            })

            # Check max file limit to avoid memory overload
            if len(complexity_data) > MAX_COMPLEXITY_FILES:
                raise ValueError(
                    f"Too many files analyzed (> {MAX_COMPLEXITY_FILES}). Please filter or reduce repo size."
                )

        except Exception:
            continue  # Silently skip files that throw errors

    # Apply pagination to the result list
    start = (page - 1) * limit
    end = start + limit

    return complexity_data[start:end]






