import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AnalysisResponse {
  status: string;
  detail: string;
}

const Analyze: React.FC = () => {
  const [repoPath, setRepoPath] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [success, setSuccess] = useState(false);
  const [successPath, setSuccessPath] = useState('');
  const navigate = useNavigate();

  const handlePathSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoPath.trim()) {
      setMessage({ type: 'error', text: 'Please enter a repository path' });
      return;
    }
    setIsAnalyzing(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('repo_path', repoPath);
      const response = await fetch('/analyze', {
        method: 'POST',
        body: formData,
      });
      const data: AnalysisResponse = await response.json();
      if (response.ok) {
        setSuccess(true);
        setSuccessPath(repoPath);
        setTimeout(() => navigate('/metrics'), 2000);
      } else {
        setMessage({ type: 'error', text: data.detail });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to analyze repository. Please check your connection.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a ZIP file' });
      return;
    }
    setIsAnalyzing(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const response = await fetch('/analyze', {
        method: 'POST',
        body: formData,
      });
      const data: AnalysisResponse = await response.json();
      if (response.ok) {
        setSuccess(true);
        setSuccessPath(selectedFile.name);
        setTimeout(() => navigate('/metrics'), 2000);
      } else {
        setMessage({ type: 'error', text: data.detail });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload and analyze repository.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/zip') {
      setSelectedFile(file);
      setMessage(null);
    } else if (file) {
      setMessage({ type: 'error', text: 'Please select a ZIP file' });
      setSelectedFile(null);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center">
          <div className="text-green-500 text-6xl mb-4">✔️</div>
          <h2 className="text-2xl font-bold mb-2">Repository analyzed successfully!</h2>
          <p className="text-gray-600 mb-2">
            <span className="font-mono text-blue-700">{successPath}</span>
          </p>
          <p className="text-gray-500">Redirecting to metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Analyze Repository</h1>
          <p className="text-gray-600">
            Upload a ZIP file or provide a local path to analyze your repository
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Local Path Input */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Local Repository Path</h3>
            <form onSubmit={handlePathSubmit}>
              <div className="mb-4">
                <label htmlFor="repoPath" className="block text-sm font-medium text-gray-700 mb-2">
                  Repository Path
                </label>
                <input
                  type="text"
                  id="repoPath"
                  value={repoPath}
                  onChange={(e) => setRepoPath(e.target.value)}
                  placeholder="/path/to/your/repository"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isAnalyzing}
                />
              </div>
              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Repository'}
              </button>
            </form>
          </div>

          {/* File Upload */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Upload ZIP File</h3>
            <form onSubmit={handleFileSubmit}>
              <div className="mb-4">
                <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-2">
                  Repository ZIP File
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  accept=".zip"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isAnalyzing}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a ZIP file containing your repository
                </p>
              </div>
              <button
                type="submit"
                disabled={isAnalyzing || !selectedFile}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? 'Uploading & Analyzing...' : 'Upload & Analyze'}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Make sure your repository contains source code files</li>
            <li>• Supported file extensions: .py, .js, .ts, .java, .cpp, .c, .go, .rs, .php, .rb</li>
            <li>• For ZIP uploads, ensure the repository is at the root of the ZIP file</li>
            <li>• Analysis may take a few moments depending on repository size</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analyze; 