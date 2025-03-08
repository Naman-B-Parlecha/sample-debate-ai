import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearAuthToken } from '@/context/AuthContext';

const NavBar= () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearAuthToken());
        navigate('/login');
    };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center">
        <img src="/aossie.png" alt="Logo" className="h-8 w-8 mr-2" />
        <span className="font-semibold text-lg">DebateAI</span>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/create-room')}>
          Create Room
        </Button>
        <Button variant="outline" onClick={() => navigate('/join-room')}>
          Join Room
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-1" />
          Logout
        </Button>
        <Button variant="ghost" onClick={() => navigate('/profile')}>
          <User className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;