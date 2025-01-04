import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes/Routes'; // Import Routes

const App = () => {
  return (
    <Router>
      <Routes /> {/* Gunakan Routes untuk menampilkan rute */}
    </Router>
  );
};

export default App;