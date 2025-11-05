import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { messageService } from '../services/messageService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';

function ComposeMessage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [formData, setFormData] = useState({
    recipientId: '',
    subject: '',
    content: '',
  });

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    try {
      // Om patient, visa läkare och personal
      if (user.role === 'PATIENT') {
        const doctors = await userService.getUsersByRole('DOCTOR');
        const staff = await userService.getUsersByRole('STAFF');
        setRecipients([...doctors, ...staff]);
      } else {
        // Om läkare/personal, visa alla användare
        const allUsers = await userService.getAllUsers();
        setRecipients(allUsers.filter(u => u.id !== user.id));
      }
    } catch (error) {
      console.error('Failed to load recipients:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const messageData = {
        sender: { id: user.id },
        recipient: { id: parseInt(formData.recipientId) },
        subject: formData.subject,
        content: formData.content,
      };

      await messageService.sendMessage(messageData);
      alert('Message sent!');
      navigate('/messages');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>New Message</h1>

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            To *
          </label>
          <select
            value={formData.recipientId}
            onChange={(e) => setFormData({ ...formData, recipientId: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '3px' }}
          >
            <option value="">Select recipient</option>
            {recipients.map((recipient) => (
              <option key={recipient.id} value={recipient.id}>
                {recipient.firstName} {recipient.lastName} ({recipient.role})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Subject *
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '3px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Message *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            rows={10}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '3px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/messages')}
            style={{
              padding: '10px 20px',
              background: '#ddd',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ComposeMessage;