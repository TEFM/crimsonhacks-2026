import { createRoot } from 'react-dom/client';
import { Dashboard } from './views/Dashboard';
import { BillDetail } from './views/BillDetail';
import { MeetingDetail } from './views/MeetingDetail';
import './styles.css';
import './meeting.css';

function App() {
  const match = window.location.pathname.match(/^\/bills\/([^/]+)\/?$/);
  const meetingMatch = window.location.pathname.match(/^\/meetings\/([^/]+)\/?$/);
  if (match) return <BillDetail slug={match[1]} />;
  return meetingMatch ? <MeetingDetail slug={meetingMatch[1]} /> : <Dashboard />;
}

createRoot(document.getElementById('root')).render(<App />);
