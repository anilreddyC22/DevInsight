from pydantic import BaseModel
from typing import List

class ChurnFile(BaseModel):
    file: str
    commits: int
    authors: int
    additions: int
    deletions: int
    net_changes: int

class ComplexityFile(BaseModel):
    file: str
    complexity: float
    lines: int
    functions: int
    complexity_per_line: float

class HotspotFile(BaseModel):
    file: str
    commits: int
    complexity: float
    risk_level: str
    color: str
