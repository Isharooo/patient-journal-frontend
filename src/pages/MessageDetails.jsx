import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { messageService } from '../services/messageService';
import { useAuth } from '../context/AuthContext';

function MessageDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [replying, setReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    useEffect(() => {
        loadMessage();
    }, [id]);

    const loadMessage = async () => {
        try {
            const data = await messageService.getMessageById(id);
            setMessage(data);

            // Mark as read if recipient
            if (data.recipientId === user.id && !data.isRead) {
                await messageService.markAsRead(id);
            }
        } catch (error) {
            console.error('Failed to load message:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        setReplying(true);

        try {
            const replyData = {
                sender: { id: user.id },
                recipient: { id: message.senderId },
                subject: `Re: ${message.subject}`,
                content: replyContent,
            };

            await messageService.sendMessage(replyData);
            alert('Reply sent!');
            navigate('/messages');
        } catch (error) {
            console.error('Failed to send reply:', error);
            alert('Failed to send reply');
        } finally {
            setReplying(false);
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
    if (!message) return <div style={{ padding: '20px' }}>Message not found</div>;

    const isRecipient = message.recipientId === user.id;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/messages')}
                style={{
                    padding: '8px 16px',
                    background: '#ddd',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                }}
            >
                ← Back to Messages
            </button>

            <div style={{ background: 'white', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
                <h2>{message.subject}</h2>
                <div style={{ color: '#666', marginBottom: '15px' }}>
                    <p><strong>From:</strong> {message.senderName}</p>
                    <p><strong>To:</strong> {message.recipientName}</p>
                    <p><strong>Date:</strong> {new Date(message.sentAt).toLocaleString()}</p>
                </div>
                <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
                </div>
            </div>

            {isRecipient && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
                    <h3>Reply</h3>
                    <form onSubmit={handleReply}>
            <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                required
                rows={6}
                placeholder="Write your reply..."
                style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '3px',
                    marginBottom: '10px',
                }}
            />
                        <button
                            type="submit"
                            disabled={replying}
                            style={{
                                padding: '10px 20px',
                                background: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                            }}
                        >
                            {replying ? 'Sending...' : 'Send Reply'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default MessageDetails;