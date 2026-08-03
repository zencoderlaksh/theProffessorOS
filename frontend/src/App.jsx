import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import AppRoutes from './routes/AppRoutes';
import TeachingAssistantModal from './components/TeachingAssistantModal';
import './index.css';

function MainLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <div className="bg-[#000000] min-h-screen font-outfit text-white">
        <AppRoutes />
      </div>
    );
  }

  return (
    <div className="flex bg-[#000000] min-h-screen font-outfit selection:bg-[#FF5D73] selection:text-white overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 pt-16 md:pt-0 min-h-screen overflow-x-hidden w-full">
        <AppRoutes />
      </main>
      <TeachingAssistantModal />
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
