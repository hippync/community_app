import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Accueil from './pages/Accueil';
import Fonctionnement from './pages/Fonctionnement';
import Communaute from './pages/Communaute';
import Rejoindre from './pages/Rejoindre';
import Securite from './pages/Securite';
import Decouvrir from './pages/Decouvrir';

function App() {
  const [currentPage, setCurrentPage] = useState('decouvrir');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'decouvrir':
        return <Decouvrir onNavigate={setCurrentPage} />;
      case 'accueil':
        return <Accueil onNavigate={setCurrentPage} />;
      case 'fonctionnement':
        return <Fonctionnement onNavigate={setCurrentPage} />;
      case 'communaute':
        return <Communaute onNavigate={setCurrentPage} />;
      case 'securite':
        return <Securite onNavigate={setCurrentPage} />;
      case 'rejoindre':
        return <Rejoindre />;
      default:
        return <Decouvrir onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="pt-20">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
