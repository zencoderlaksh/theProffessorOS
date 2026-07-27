import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import AppRoutes from './routes/AppRoutes';
import TeachingAssistantModal from './components/TeachingAssistantModal';
import './index.css';

function App() {
  return (
    <Router>
      <div className="flex bg-[#000000] min-h-screen font-outfit selection:bg-[#FF5D73] selection:text-white">
        <Sidebar />
        <main className="flex-1 ml-64 overflow-y-auto">
          <AppRoutes />
        </main>
        <TeachingAssistantModal />
      </div>
    </Router>
  );
}

export default App;
