import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

function DoctorDashboard() {
    const { user } = useAuth();

    return (
        <div className="dashboard">
            <h1>Doctor Dashboard</h1>
            <p>Welcome, Dr. {user.firstName} {user.lastName}!</p>

            <div className="dashboard-cards">
                <div className="card">
                    <h3>Patients</h3>
                    <p>View and manage patients</p>
                </div>
                <div className="card">
                    <h3>Appointments</h3>
                    <p>Today's appointments</p>
                </div>
                <div className="card">
                    <h3>Messages</h3>
                    <p>Patient messages</p>
                </div>
            </div>
        </div>
    );
}

export default DoctorDashboard;