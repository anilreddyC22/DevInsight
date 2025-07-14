import React, { useState, useEffect } from 'react';
import ChurnTable from '../components/ChurnTable';
import ComplexityTable from '../components/ComplexityTable';
import HotspotsTable from '../components/HotspotsTable';
import FileFilterBar from '../components/FileFilterBar';


const Metrics = () => {
  const [activeTab, setActiveTab] = useState('hotspots');
  const [churnData, setChurnData] = useState([]);
  const [complexityData, setComplexityData] = useState([]);
  const [hotspotsData, setHotspotsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileFilter, setFileFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [churnLoaded, setChurnLoaded] = useState(false);
  const [complexityLoaded, setComplexityLoaded] = useState(false);
  const [hotspotsLoaded, setHotspotsLoaded] = useState(false);

  const fetchData = async (endpoint: string, params: Record<string, any> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(fileFilter && { ext: fileFilter }),
        ...params
      });
      const response = await fetch(`/${endpoint}?${queryParams}`);
      if (response.status === 204) {
        setLoading(false);
        return [];
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch data');
      }
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      return [];
    }
  };

  const loadChurnData = async () => {
    setChurnLoaded(false);
    const data = await fetchData('churn-metrics');
    setChurnData(data);
    setChurnLoaded(true);
  };

  const loadComplexityData = async () => {
    setComplexityLoaded(false);
    const data = await fetchData('complexity-metrics');
    setComplexityData(data);
    setComplexityLoaded(true);
  };

  const loadHotspotsData = async () => {
    setHotspotsLoaded(false);
    const data = await fetchData('hotspots', {
      churn_threshold: 5,
      complexity_threshold: 5.0,
      top_n: 10000
    });
    setHotspotsData(data);
    setHotspotsLoaded(true);
  };

  useEffect(() => {
    if (activeTab === 'churn') loadChurnData();
    else if (activeTab === 'complexity') loadComplexityData();
    else if (activeTab === 'hotspots') loadHotspotsData();
  }, [activeTab, page, limit, fileFilter]);

  const tabs = [
    { id: 'hotspots', label: 'Hotspots', icon: '🔥' },
    { id: 'churn', label: 'Churn Metrics', icon: '📊' },
    { id: 'complexity', label: 'Complexity Metrics', icon: '🧮' },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading data...</span>
        </div>
      );
    }
    if (error) {
      return (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      );
    }

    if (activeTab === 'hotspots') {
      return hotspotsLoaded ? (
        hotspotsData.length > 0 ? <HotspotsTable data={hotspotsData} /> : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hotspots found</h3>
            <p className="text-gray-600">Try adjusting the thresholds or file filters</p>
          </div>
        )
      ) : null;
    }

    if (activeTab === 'churn') {
      return churnLoaded ? (
        churnData.length > 0 ? <ChurnTable data={churnData} /> : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No churn data available</h3>
            <p className="text-gray-600">Make sure you have analyzed a repository first</p>
          </div>
        )
      ) : null;
    }

    if (activeTab === 'complexity') {
      return complexityLoaded ? (
        complexityData.length > 0 ? <ComplexityTable data={complexityData} /> : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🧮</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No complexity data available</h3>
            <p className="text-gray-600">Make sure you have analyzed a repository first</p>
          </div>
        )
      ) : null;
    }

    return null;
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Repository Metrics</h1>
          <p className="text-gray-600">Analyze code churn, complexity, and identify potential hotspots</p>
        </div>

        <FileFilterBar
          fileFilter={fileFilter}
          onFileFilterChange={setFileFilter}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Metrics;
