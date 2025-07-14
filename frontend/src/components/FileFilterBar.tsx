import React from 'react';

interface FileFilterBarProps {
  fileFilter: string;
  onFileFilterChange: (filter: string) => void;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const FileFilterBar: React.FC<FileFilterBarProps> = ({
  fileFilter,
  onFileFilterChange,
  page,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* File Extension Filter */}
        <div className="flex-1 min-w-64">
          <label htmlFor="fileFilter" className="block text-sm font-medium text-gray-700 mb-1">
            File Extensions
          </label>
          <input
            type="text"
            id="fileFilter"
            value={fileFilter}
            onChange={(e) => onFileFilterChange(e.target.value)}
            placeholder="e.g., py,java,js (comma-separated)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Page Size */}
        <div>
          <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
            Items per page
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Pagination */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm text-gray-700">
            Page {page}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileFilterBar; 