import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hapiPatientService } from '../services/hapiPatientService';

function HapiPatientList() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            setLoading(true);
            const data = await hapiPatientService.getAllPatients();
            setPatients(data);
            setError(null);
        } catch (error) {
            console.error('Failed to load patients from HAPI:', error);
            setError('Failed to load patients from HAPI FHIR server');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading patients from HAPI FHIR server...</div>;

    if (error) return (
        <div style={{ padding: '20px', color: 'red' }}>
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={loadPatients}>Retry</button>
        </div>
    );

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Patients (HAPI FHIR)</h1>
                <button
                    onClick={loadPatients}
                    style={{
                        padding: '10px 20px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                    }}
                >
                    Refresh
                </button>
            </div>

            <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                <p style={{ margin: 0 }}>
                    <strong>Data Source:</strong> HAPI FHIR Server (https://hapi-fhir.app.cloud.cbh.kth.se/fhir)
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>
                    Total patients: {patients.length}
                </p>
            </div>

            <div style={{ background: 'white', borderRadius: '5px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '15px', textAlign: 'left' }}>FHIR ID</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Personal Number</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Date of Birth</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '15px', fontFamily: 'monospace' }}>{patient.id}</td>
                            <td style={{ padding: '15px' }}>
                                {patient.user?.firstName} {patient.user?.lastName}
                            </td>
                            <td style={{ padding: '15px' }}>{patient.personalNumber || 'N/A'}</td>
                            <td style={{ padding: '15px' }}>{patient.dateOfBirth || 'N/A'}</td>
                            <td style={{ padding: '15px' }}>
                                <button
                                    onClick={() => navigate(`/hapi/patients/${patient.id}`)}
                                    style={{
                                        padding: '5px 15px',
                                        background: '#667eea',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '3px',
                                        cursor: 'pointer',
                                        marginRight: '5px',
                                    }}
                                >
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HapiPatientList;