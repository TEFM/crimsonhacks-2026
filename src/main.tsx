import { createRoot } from 'react-dom/client';
import { Dashboard } from './views/Dashboard';
import './styles.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Beehive Brief could not find its application root.');
}

createRoot(root).render(<Dashboard />);
