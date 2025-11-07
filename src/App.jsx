import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import PatientList from './pages/PatientList';
import PatientDetails from './pages/PatientDetails';
import Unauthorized from './pages/Unauthorized';
import CreateEncounter from './pages/CreateEncounter';
import CreateObservation from './pages/CreateObservation';
import CreateCondition from './pages/CreateCondition';
import Messages from './pages/Messages';
import ComposeMessage from './pages/ComposeMessage';
import MessageDetails from './pages/MessageDetails';

import HapiPatientList from './pages/HapiPatientList';
import HapiPatientDetails from './pages/HapiPatientDetails';

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

                    {/* Original local database routes */}
                    <Route
                        path="/dashboard/doctor"
                        element={<Navigate to="/patients" replace />}
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

                    {/* HAPI FHIR Routes */}
                    <Route
                        path="/hapi/patients"
                        element={
                            <ProtectedRoute allowedRoles={['DOCTOR', 'STAFF']}>
                                <HapiPatientList />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/hapi/patients/:id"
                        element={
                            <ProtectedRoute allowedRoles={['DOCTOR', 'STAFF']}>
                                <HapiPatientDetails />
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
                    <Route
                        path="/messages"
                        element={
                            <ProtectedRoute>
                                <Messages />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/messages/compose"
                        element={
                            <ProtectedRoute>
                                <ComposeMessage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/messages/:id"
                        element={
                            <ProtectedRoute>
                                <MessageDetails />
                            </ProtectedRoute>
                        }
                    />
                </Routes>

            </Router>
        </AuthProvider>
    );
}

export default App;