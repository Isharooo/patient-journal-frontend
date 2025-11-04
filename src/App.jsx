import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import PatientList from './pages/PatientList';
import PatientDetails from './pages/PatientDetails';
import Unauthorized from './pages/Unauthorized';
import CreateEncounter from './pages/CreateEncounter';
import CreateObservation from './pages/CreateObservation';
import CreateCondition from './pages/CreateCondition';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    <Route
                        path="/dashboard/doctor"
                        element={
                            <ProtectedRoute allowedRoles={['DOCTOR', 'STAFF']}>
                                <DoctorDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/dashboard/patient"
                        element={
                            <ProtectedRoute allowedRoles={['PATIENT']}>
                                <PatientDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/patients"
                        element={
                            <ProtectedRoute allowedRoles={['DOCTOR', 'STAFF']}>
                                <PatientList />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/patients/:id"
                        element={
                            <ProtectedRoute allowedRoles={['DOCTOR', 'STAFF']}>
                                <PatientDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/" element={<Navigate to="/login" replace />} />

                    <Route
                        path="/patients/:patientId/encounters/create"
                        element={
                            <ProtectedRoute allowedRoles={['DOCTOR', 'STAFF']}>
                                <CreateEncounter />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/patients/:patientId/observations/create"
                        element={
                            <ProtectedRoute allowedRoles={['DOCTOR', 'STAFF']}>
                                <CreateObservation />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/patients/:patientId/conditions/create"
                        element={
                            <ProtectedRoute allowedRoles={['DOCTOR', 'STAFF']}>
                                <CreateCondition />
                            </ProtectedRoute>
                        }
                    />
                </Routes>

            </Router>
        </AuthProvider>
    );
}

export default App;