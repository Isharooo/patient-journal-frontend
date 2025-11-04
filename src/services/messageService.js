import api from './api';

export const messageService = {
    sendMessage: async (messageData) => {
        const response = await api.post('/messages', messageData);
        return response.data;
    },

    getMessageById: async (id) => {
        const response = await api.get(`/messages/${id}`);
        return response.data;
    },

    getSentMessages: async (userId) => {
        const response = await api.get(`/messages/sent/${userId}`);
        return response.data;
    },

    getReceivedMessages: async (userId) => {
        const response = await api.get(`/messages/received/${userId}`);
        return response.data;
    },

    getUnreadMessages: async (userId) => {
        const response = await api.get(`/messages/unread/${userId}`);
        return response.data;
    },

    markAsRead: async (id) => {
        const response = await api.put(`/messages/${id}/read`);
        return response.data;
    },
};