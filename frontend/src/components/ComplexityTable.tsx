import React from 'react';

interface ComplexityData {
  file: string;
  complexity: number;
  lines: number;
  functions: number;
}

interface ComplexityTableProps {
  data: ComplexityData[];
}

const ComplexityTable: React.FC<ComplexityTableProps> = ({ data }) => {
  const getComplexityColor = (complexity: number) => {
    if (complexity >= 15) return 'bg-red-100 text-red-800';
    if (complexity >= 8) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getComplexityLabel = (complexity: number) => {
    if (complexity >= 15) return 'High';
    if (complexity >= 8) return 'Medium';
    return 'Low';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              File
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Complexity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lines
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Functions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Complexity/Lines
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
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplexityColor(item.complexity)}`}>
                  {item.complexity} ({getComplexityLabel(item.complexity)})
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {typeof item.lines === 'number' ? item.lines.toLocaleString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {typeof item.functions === 'number' ? item.functions : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {typeof item.lines === 'number' && item.lines !== 0
                  ? ((item.complexity / item.lines) * 100).toFixed(2) + '%'
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplexityTable; 