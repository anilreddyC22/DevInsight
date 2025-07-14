from pathlib import Path
from git import Repo
from collections import defaultdict
from utils.file_utils import is_valid_code_file
from config.constants import MAX_ANALYZABLE_FILES  # ← make sure this is defined

def get_git_stats(repo_path, page=1, limit=100, allowed_exts=None):
    repo = Repo(repo_path)
    file_commits = defaultdict(set)
    file_authors = defaultdict(set)
    file_additions = defaultdict(int)
    file_deletions = defaultdict(int)

    for commit in repo.iter_commits('--all'):
        author = commit.author.email

        for file in commit.stats.files:
            full_path = Path(repo.working_dir) / file
            normalized_path = Path(file).as_posix().lower()
            ext = Path(file).suffix.lower()

            # ✅ Check extension filter if provided
            if allowed_exts and ext not in allowed_exts:
                continue

            # ✅ Also respect other rules (extension, binary, excluded dirs)
            if not is_valid_code_file(full_path):
                continue

            file_commits[normalized_path].add(commit.hexsha)
            file_authors[normalized_path].add(author)
            file_additions[normalized_path] += commit.stats.files[file]['insertions']
            file_deletions[normalized_path] += commit.stats.files[file]['deletions']

    all_files = list(file_commits.keys())

    if len(all_files) > MAX_ANALYZABLE_FILES:
        raise ValueError(f"Too many files to analyze. Found {len(all_files)}, max allowed is {MAX_ANALYZABLE_FILES}")

    # ✅ Pagination logic
    start = (page - 1) * limit
    end = start + limit
    paginated_files = all_files[start:end]

    stats = []
    for file in paginated_files:
        stats.append({
            'file': file,
            'commits': len(file_commits[file]),
            'authors': len(file_authors[file]),
            'additions': file_additions[file],
            'deletions': file_deletions[file],
            'net_changes': file_additions[file] - file_deletions[file]
        })

    return stats





