import React from 'react';

interface ChurnData {
  file: string;
  commits: number;
  additions: number;
  deletions: number;
}

interface ChurnTableProps {
  data: ChurnData[];
}

const ChurnTable: React.FC<ChurnTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              File
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Commits
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Additions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deletions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Net Changes
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="truncate max-w-xs" title={item.file}>
                  {item.file}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {item.commits}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                +{item.additions}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                -{item.deletions}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`font-medium ${
                  item.additions - item.deletions > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.additions - item.deletions > 0 ? '+' : ''}{item.additions - item.deletions}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChurnTable; 