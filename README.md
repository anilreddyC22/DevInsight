# DevInsight

DevInsight is a modern, full-stack developer tool that helps you analyze code quality, track code churn, measure complexity, and identify risky hotspots in your repositories. It provides actionable insights to help you maintain, refactor, and improve your codebase over time.

---

## 🚀 Features

- **Repository Analysis:** Upload a ZIP file or provide a local path to analyze your codebase.
- **Churn Metrics:** See which files change most often, helping you spot unstable or high-churn areas.
- **Complexity Analysis:** Measure code complexity to identify files that may be difficult to maintain or understand.
- **Hotspot Detection:** Find files that are both complex and frequently changed—these are your riskiest hotspots.
- **File Filtering:** Filter metrics by file extension (e.g., `.py`, `.js`, `.java`).
- **Pagination:** Efficiently browse large codebases.
- **Modern UI:** Beautiful, responsive frontend built with React and Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, React Router
- **Backend:** FastAPI (Python), Pydantic, Uvicorn
- **Other:** GitPython (for churn metrics), Radon (for complexity), REST API

---

## 📦 Project Structure

```
devinsight/
├── backend/
│   ├── main.py                # FastAPI app and endpoints
│   ├── models/                # Pydantic response models
│   ├── services/              # Churn, complexity, and git analysis logic
│   ├── utils/                 # Utility functions
│   └── requirements.txt       # Python dependencies
└── frontend/
    ├── src/
    │   ├── components/        # Reusable React components
    │   ├── pages/             # Page-level React components
    │   ├── App.tsx            # Main app and routing
    │   └── index.tsx          # Entry point
    ├── public/
    ├── tailwind.config.js
    ├── package.json
    └── ...
```

---

## ⚡ Quick Start

### 1. Clone the Repository
```sh
git clone https://github.com/YOUR-USERNAME/DevInsight.git
cd DevInsight
```

### 2. Backend Setup
```sh
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend Setup
```sh
cd ../frontend
npm install
npm start
```

- The frontend will run at [http://localhost:3000](http://localhost:3000)
- The backend will run at [http://localhost:8000](http://localhost:8000)

---

## 🖥️ Usage

1. **Analyze a Repository:**
   - Go to the "Analyze Repo" page.
   - Enter a local path or upload a ZIP file of your repository.
   - Click "Analyze Repository".
2. **View Metrics:**
   - After analysis, you’ll be redirected to the metrics dashboard.
   - Explore Churn Metrics, Complexity Metrics, and Hotspots using the tabs.
   - Filter by file extension or paginate through results.

---

## 📊 How It Works

- **Churn Metrics:** Uses Git history to count commits, additions, and deletions per file.
- **Complexity Analysis:** Uses static analysis tools (like Radon) to measure code complexity per file.
- **Hotspot Detection:** Combines churn and complexity to highlight risky files.

---

## 🤝 Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit and push (`git commit -m "Add feature" && git push origin feature/your-feature`)
5. Open a Pull Request on GitHub

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙋‍♂️ Questions or Feedback?

Open an issue or discussion on GitHub, or contact the maintainer. 