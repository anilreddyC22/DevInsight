# DevInsight Frontend

A modern React + TypeScript frontend for the DevInsight code quality analysis tool.

## Features

- 🏠 **Home Dashboard** - Welcome page with quick actions
- 📊 **Repository Analysis** - Upload ZIP files or provide local paths
- 📈 **Metrics Dashboard** - View churn, complexity, and hotspots data
- 🔍 **File Filtering** - Filter by file extensions
- 📄 **Pagination** - Navigate through large datasets
- 🎨 **Modern UI** - Built with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:8000`

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd devinsight/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The app will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── ChurnTable.tsx  # Churn metrics table
│   ├── ComplexityTable.tsx # Complexity metrics table
│   ├── HotspotsTable.tsx   # Hotspots table
│   └── FileFilterBar.tsx   # Filter and pagination controls
├── pages/              # Page components
│   ├── Home.tsx        # Home dashboard
│   ├── Analyze.tsx     # Repository analysis
│   └── Metrics.tsx     # Metrics dashboard
├── App.tsx             # Main app component
├── index.tsx           # App entry point
└── index.css           # Global styles with Tailwind
```

## API Integration

The frontend communicates with the backend API endpoints:

- `POST /analyze` - Analyze repository
- `GET /churn-metrics` - Get churn data
- `GET /complexity-metrics` - Get complexity data
- `GET /hotspots` - Get hotspots data

## Styling

The app uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`.

## Development

The app is configured with:
- TypeScript for type safety
- React Router for navigation
- Tailwind CSS for styling
- Proxy configuration to backend API

## Troubleshooting

If you encounter TypeScript errors about missing React types, ensure all dependencies are installed:

```bash
npm install
```

If the backend connection fails, make sure:
1. The backend server is running on port 8000
2. CORS is properly configured
3. The proxy setting in package.json is correct 