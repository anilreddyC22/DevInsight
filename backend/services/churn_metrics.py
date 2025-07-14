import os
from pathlib import Path

def get_hotspots(
    churn_data,
    complexity_data,
    churn_threshold=5,
    complexity_threshold=5.0,
    top_n=10000,
    page=1,
    limit=10,
    allowed_exts=None  # optional: for extension filtering
):
    def normalize(path):
        return os.path.normpath(path).replace("\\", "/").lower()

    # Optional extension filtering
    if allowed_exts:
        churn_data = [f for f in churn_data if Path(f['file']).suffix.lower() in allowed_exts]
        complexity_data = [f for f in complexity_data if Path(f['file']).suffix.lower() in allowed_exts]

    # Normalize and build complexity lookup
    complexity_map = {
        normalize(item['file']): item['complexity']
        for item in complexity_data
    }

    # Match churn with complexity to find hotspots
    hotspots = []
    for item in churn_data:
        file_path = normalize(item['file'])
        if (
            file_path in complexity_map and
            item['commits'] >= churn_threshold and
            complexity_map[file_path] >= complexity_threshold
        ):
            complexity = complexity_map[file_path]

            # Risk level classification
            if item['commits'] >= 10 or complexity >= 15:
                risk_level = "High 🔥"
                color = "red"
            elif item['commits'] >= 5 or complexity >= 8:
                risk_level = "Medium ⚠️"
                color = "orange"
            else:
                risk_level = "Low ✅"
                color = "green"

            hotspots.append({
                "file": item['file'],
                "commits": item['commits'],
                "complexity": complexity,
                "risk_level": risk_level,
                "color": color
            })

    # Sort by risk score and apply top_n and pagination
    hotspots.sort(key=lambda x: x['commits'] * x['complexity'], reverse=True)
    top_hotspots = hotspots[:top_n]
    start = (page - 1) * limit
    end = start + limit

    return top_hotspots[start:end]



