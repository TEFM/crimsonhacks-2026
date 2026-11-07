import { createRoot } from 'react-dom/client';
import { Dashboard } from './views/Dashboard';
import { BillDetail } from './views/BillDetail';
import './styles.css';

function App() {
  const match = window.location.pathname.match(/^\/bills\/([^/]+)\/?$/);
  return match ? <BillDetail slug={match[1]} /> : <Dashboard />;
}

createRoot(document.getElementById('root')).render(<App />);
