from fastapi import FastAPI, UploadFile, File, Form, Response
from fastapi.responses import JSONResponse
from models.response_models import ChurnFile, ComplexityFile, HotspotFile
from typing import Optional
import os
import tempfile
from services.git_analyzer import get_git_stats
from services.complexity_analyzer import get_complexity
from services.churn_metrics import get_hotspots
from utils.file_utils import resolve_path
from typing import List
from fastapi import Query
from pathlib import Path


app = FastAPI()

# Store the last analyzed repo path in memory (for demo purposes)
last_repo_path = None

@app.get("/")
def root():
    return {"message": "DevInsight Backend is running!"}

@app.post("/analyze")
def analyze_repo(repo_path: Optional[str] = Form(None), file: Optional[UploadFile] = File(None)):
    global last_repo_path
    # Case 1: Local path provided
    if repo_path:
        abs_path = resolve_path(repo_path)
        if not os.path.isdir(abs_path):
            return JSONResponse(status_code=400, content={"status": "error", "detail": "Invalid repo path."})
        last_repo_path = abs_path
        return {"status": "success", "detail": f"Analyzed repo at {abs_path}"}

    # Case 2: ZIP file upload
    elif file and file.filename:
        with tempfile.TemporaryDirectory() as tmpdir:
            zip_path = os.path.join(tmpdir, file.filename)
            with open(zip_path, "wb") as f:
                f.write(file.file.read())
            import zipfile
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(tmpdir)
            # Assume the repo is extracted to the first folder in tmpdir
            extracted_dirs = [os.path.join(tmpdir, d) for d in os.listdir(tmpdir) if os.path.isdir(os.path.join(tmpdir, d))]
            if not extracted_dirs:
                return JSONResponse(status_code=400, content={"status": "error", "detail": "No repo found in zip."})
            last_repo_path = extracted_dirs[0]
            return {"status": "success", "detail": f"Analyzed repo from zip: {file.filename}"}
    
    return JSONResponse(status_code=400, content={"status": "error", "detail": "No repo path or file provided."})

@app.get("/churn-metrics", response_model=List[ChurnFile])
def get_churn(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=1000, description="Number of items per page"),
    ext: Optional[str] = Query(None, description="Comma-separated list of file extensions to filter by (e.g., 'py,java')")
):
    global last_repo_path
    if not last_repo_path:
        return JSONResponse(status_code=400, content={
            "status": "error",
            "detail": "No repo analyzed yet."
        })

    try:
        # Parse extension filter if provided
        allowed_exts = set()
        if ext:
            allowed_exts = {f".{e.strip().lower()}" for e in ext.split(",")}

        churn_data = get_git_stats(last_repo_path, page=page, limit=limit, allowed_exts=allowed_exts)

        if not churn_data:
            return Response(status_code=204)

        return churn_data

    except ValueError as ve:
        return JSONResponse(status_code=413, content={
            "status": "error",
            "detail": str(ve)
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={
            "status": "error",
            "detail": str(e)
        })


@app.get("/complexity-metrics", response_model=List[ComplexityFile])
def get_complexity_metrics(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(100, ge=1, le=1000, description="Number of items per page"),
    ext: Optional[str] = Query(None, description="Comma-separated file extensions to filter by (e.g., 'py,java')")
):
    if not last_repo_path:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "detail": "No repo analyzed yet."}
        )

    try:
        # Build set of allowed extensions if provided
        allowed_exts = set()
        if ext:
            allowed_exts = {f".{e.strip().lower()}" for e in ext.split(",")}

        # Call complexity analyzer with optional extension filtering
        complexity_data = get_complexity(
            last_repo_path,
            page=page,
            limit=limit,
            allowed_exts=allowed_exts
        )

        if not complexity_data:
            return Response(status_code=204)

        return complexity_data

    except ValueError as ve:
        return JSONResponse(
            status_code=413,
            content={"status": "error", "detail": str(ve)}
        )

    except Exception as e:
        print("🚨 Error in get_complexity_metrics:", str(e))
        return JSONResponse(
            status_code=500,
            content={"status": "error", "detail": str(e)}
        )

@app.get("/hotspots", response_model=List[HotspotFile])
def get_hotspots_endpoint(
    churn_threshold: int = Query(5, description="Min number of commits"),
    complexity_threshold: float = Query(5.0, description="Min code complexity"),
    top_n: int = Query(10000, description="Total number of risky files to consider"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=1000, description="Number of items per page"),
    ext: Optional[str] = Query(None, description="Comma-separated list of file extensions to filter by (e.g., 'py,java')")
):
    # Check if a repository has been analyzed yet
    if not last_repo_path:
        return JSONResponse(status_code=400, content={"status": "error", "detail": "No repo analyzed yet."})

    # Get churn and complexity data from the analyzed repository
    churn_data = get_git_stats(last_repo_path)
    complexity_data = get_complexity(last_repo_path)

    # Parse extension filter (e.g., ['.py', '.java'])
    allowed_exts = set()
    if ext:
        allowed_exts = {f".{e.strip().lower()}" for e in ext.split(",")}
        churn_data = [f for f in churn_data if Path(f['file']).suffix.lower() in allowed_exts]
        complexity_data = [f for f in complexity_data if Path(f['file']).suffix.lower() in allowed_exts]

    # Combine churn and complexity data to find hotspots
    hotspots = get_hotspots(
        churn_data,
        complexity_data,
        churn_threshold=churn_threshold,
        complexity_threshold=complexity_threshold,
        top_n=top_n
    )

    # Return early if no hotspots found
    if not hotspots:
        return Response(status_code=204)

    # Sort hotspots by risk score (commits * complexity)
    hotspots.sort(key=lambda x: x['commits'] * x['complexity'], reverse=True)

    # Take top N risky files
    top_hotspots = hotspots[:top_n]

    # Apply pagination
    start = (page - 1) * limit
    end = start + limit
    paginated = top_hotspots[start:end]

    # Return early if the current page is empty
    if not paginated:
        return Response(status_code=204)

    return paginated
