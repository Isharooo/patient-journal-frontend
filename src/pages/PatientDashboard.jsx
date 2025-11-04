import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

function PatientDashboard() {
    const { user } = useAuth();

    return (
        <div className="dashboard">
            <h1>Patient Dashboard</h1>
            <p>Welcome, {user.firstName} {user.lastName}!</p>

            <div className="dashboard-cards">
                <div className="card">
                    <h3>My Information</h3>
                    <p>View your medical information</p>
                </div>
                <div className="card">
                    <h3>My Appointments</h3>
                    <p>Upcoming appointments</p>
                </div>
                <div className="card">
                    <h3>Messages</h3>
                    <p>Contact your doctor</p>
                </div>
            </div>
        </div>
    );
}

export default PatientDashboard;
