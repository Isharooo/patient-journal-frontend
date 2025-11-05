import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { messageService } from '../services/messageService';
import { useAuth } from '../context/AuthContext';

function Messages() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('inbox');
    const [received, setReceived] = useState([]);
    const [sent, setSent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const receivedData = await messageService.getReceivedMessages(user.id);
            const sentData = await messageService.getSentMessages(user.id);
            setReceived(receivedData);
            setSent(sentData);
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const unreadCount = received.filter(m => !m.isRead).length;

    if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1>Messages</h1>
                <button
                    onClick={() => navigate('/messages/compose')}
                    style={{
                        padding: '10px 20px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                    }}
                >
                    + New Message
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveTab('inbox')}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        background: activeTab === 'inbox' ? '#667eea' : '#eee',
                        color: activeTab === 'inbox' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Inbox {unreadCount > 0 && `(${unreadCount})`}
                </button>
                <button
                    onClick={() => setActiveTab('sent')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'sent' ? '#667eea' : '#eee',
                        color: activeTab === 'sent' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Sent ({sent.length})
                </button>
            </div>

            {activeTab === 'inbox' && (
                <div style={{ background: 'white', borderRadius: '5px', overflow: 'hidden' }}>
                    {received.length === 0 ? (
                        <p style={{ padding: '20px' }}>No messages</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '15px', textAlign: 'left' }}>From</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Subject</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {received.map((message) => (
                                <tr
                                    key={message.id}
                                    onClick={() => navigate(`/messages/${message.id}`)}
                                    style={{
                                        borderBottom: '1px solid #eee',
                                        cursor: 'pointer',
                                        background: message.isRead ? 'white' : '#f0f0ff',
                                        fontWeight: message.isRead ? 'normal' : 'bold',
                                    }}
                                >
                                    <td style={{ padding: '15px' }}>{message.senderName}</td>
                                    <td style={{ padding: '15px' }}>{message.subject}</td>
                                    <td style={{ padding: '15px' }}>
                                        {new Date(message.sentAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        {message.isRead ? '✓ Read' : '• Unread'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {activeTab === 'sent' && (
                <div style={{ background: 'white', borderRadius: '5px', overflow: 'hidden' }}>
                    {sent.length === 0 ? (
                        <p style={{ padding: '20px' }}>No sent messages</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '15px', textAlign: 'left' }}>To</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Subject</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sent.map((message) => (
                                <tr
                                    key={message.id}
                                    onClick={() => navigate(`/messages/${message.id}`)}
                                    style={{
                                        borderBottom: '1px solid #eee',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <td style={{ padding: '15px' }}>{message.recipientName}</td>
                                    <td style={{ padding: '15px' }}>{message.subject}</td>
                                    <td style={{ padding: '15px' }}>
                                        {new Date(message.sentAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default Messages;