import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Churn Metrics',
    icon: '📊',
    description: 'See which files change most often, helping you spot unstable or high-churn areas in your codebase.',
  },
  {
    title: 'Complexity Analysis',
    icon: '🧮',
    description: 'Measure code complexity to identify files that may be difficult to maintain or understand.',
  },
  {
    title: 'Hotspot Detection',
    icon: '🔥',
    description: 'Find files that are both complex and frequently changed—these are your riskiest hotspots.',
  },
];

const Home: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
    <div className="max-w-2xl w-full text-center mt-24">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
        Welcome to DevInsight
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        DevInsight helps you understand your codebase by analyzing code churn, complexity, and hotspots. Start by analyzing a repository to unlock actionable insights!
      </p>
      <Link
        to="/analyze"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-3 rounded-lg shadow transition-colors mb-12"
      >
        Analyze Repository
      </Link>
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Home; 