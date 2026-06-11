import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import PredictorPage from './components/PredictorPage';
import AnalyticsPage from './components/AnalyticsPage';
import ModelEvalPage from './components/ModelEvalPage';
import AboutPage from './components/AboutPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/predict" element={<PredictorPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/model" element={<ModelEvalPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;
