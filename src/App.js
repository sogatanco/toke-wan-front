import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Routes from "./routes/Routes"; // Import Routes

// Buat instance QueryClient
const queryClient = new QueryClient();

const App = () => {
  return (
    // Bungkus aplikasi dengan QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes /> {/* Gunakan Routes untuk menampilkan rute */}
      </Router>
    </QueryClientProvider>
  );
};

export default App;
