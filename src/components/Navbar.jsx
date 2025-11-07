import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                Patient Journal
            </div>
            <div className="navbar-menu">
                <Link to={user.role === 'PATIENT' ? '/dashboard/patient' : '/patients'}>
                    {user.role === 'PATIENT' ? 'Dashboard' : 'Local DB'}
                </Link>
                {(user.role === 'DOCTOR' || user.role === 'STAFF') && (
                    <Link to="/hapi/patients" style={{ color: '#667eea', fontWeight: 'bold' }}>
                        HAPI FHIR
                    </Link>
                )}
                <Link to="/messages">Messages</Link>
                <span className="navbar-user">
          {user.firstName} {user.lastName}
        </span>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;