import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../services/patientService';

function PatientList() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            const data = await patientService.getAllPatients();
            setPatients(data);
        } catch (error) {
            console.error('Failed to load patients:', error);
            alert('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter((patient) =>
        patient.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.personalNumber.includes(searchTerm)
    );

    if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Patients</h1>

            <input
                type="text"
                placeholder="Search by name or personal number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                }}
            />

            <div style={{ background: 'white', borderRadius: '5px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Personal Number</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Date of Birth</th>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredPatients.map((patient) => (
                        <tr key={patient.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '15px' }}>
                                {patient.user.firstName} {patient.user.lastName}
                            </td>
                            <td style={{ padding: '15px' }}>{patient.personalNumber}</td>
                            <td style={{ padding: '15px' }}>{patient.dateOfBirth}</td>
                            <td style={{ padding: '15px' }}>
                                <button
                                    onClick={() => navigate(`/patients/${patient.id}`)}
                                    style={{
                                        padding: '5px 15px',
                                        background: '#667eea',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '3px',
                                        cursor: 'pointer',
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

export default PatientList;