import { createStore } from 'vuex';
import axios from 'axios';
import dayjs from 'dayjs';

const url = 'https://fe-sr-challenge.baymark.net/api/customers';
const token = '8def2320e7486ac76d003497fe22ce5a';

function formatLastMessage(lastMessageTime) {
    return dayjs(lastMessageTime).format('HH:mm');
}

function calculateTimeAgo(lastMessageTime) {
    const now = dayjs();
    const messageTime = dayjs(lastMessageTime);
    const diffInMinutes = now.diff(messageTime, 'minute');

    if (diffInMinutes < 60) {
        return `hace ${diffInMinutes} minuto${diffInMinutes === 1 ? '' : 's'}`;
    } else if (diffInMinutes < 1440) {
        const diffInHours = now.diff(messageTime, 'hour');
        return `hace ${diffInHours} hora${diffInHours === 1 ? '' : 's'}`;
    } else {
        const diffInDays = now.diff(messageTime, 'day');
        return `hace ${diffInDays} día${diffInDays === 1 ? '' : 's'}`;
    }
}

export default createStore({
    state: {
        conversations: [],
        chats: {
            23: [
                { from: 'user', message: 'Hola' },
                { from: 'convos', message: 'Enterate de nuestras promociones!' }
            ],
            24: [
                { from: 'user', message: 'Hola, quiero hacer un reclamo.' },
                { from: 'convos', message: 'Cualquier reclamo, consulta o sugerencia puedes contactarnos a través de nuestro WhatsApp +XXXXXXX' }
            ],
            25: [
                { from: 'user', message: '¡Buen día! Gracias por la atención que brindan!' },
                { from: 'convos', message: 'Nos encanta ayudar a las personas :)' }
            ],   
        },
        selectedConversation: null,
        isOnline : true,
    },
    mutations: {
        setConversations(state, conversations) {
            state.conversations = conversations;
        },
        setSelectedConversation(state, conversation) {
            state.selectedConversation = conversation;
        },
        setChats(state, { conversationId, message }) {
            if (!state.chats[conversationId]) {
                state.chats[conversationId] = [];
            }
            state.chats[conversationId].push(message);
        },
        clearSelectedConversation(state) {
            state.selectedConversation = null;
        },
        setUserOnline(state, status){
            state.isOnline = status;
        }
    },
    actions: {
        async fetchConversations({ commit, state }) {
            try {
                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                let data = res.data.data;
                const lastThreeConversations = data.slice(-3);
    
                data = lastThreeConversations.map(conversation => {
                    const manualLastMessageTime = '2024-09-25T18:49:29.000000Z';
                    const createdAt = conversation.created_at;
                    const updatedAt = conversation.updated_at;
                    const formatDate = dayjs(createdAt).format('DD-MM-YYYY');
                    const formatSuscriptionAt = dayjs(createdAt).format('DD-MM-YYYY HH:mm:ss');
                    const timeAgo = calculateTimeAgo(updatedAt);
    
                    const existingConversation = state.conversations.find(conv => conv.id === conversation.id);
    
                    if (existingConversation) {
                        const lastStoredMessage = state.chats[conversation.id]?.slice(-1)[0]?.message || '';
                        const lastFetchedMessage = conversation.last_message || '';
    
                        if (lastFetchedMessage !== lastStoredMessage) {
                            commit('setChats', { conversationId: conversation.id, message: { from: 'convos', message: lastFetchedMessage } });
                        }
                    }
    
                    return {
                        ...conversation,
                        lastMessage: formatLastMessage(manualLastMessageTime),
                        timeAgo: calculateTimeAgo(manualLastMessageTime),
                        assignedPerson: 'Renzo',
                        tag: 'General',
                        creationDate: `${formatDate}`,
                        suscriptionDate: `${formatSuscriptionAt}`,
                        updatedDate: `${timeAgo}`
                    };
                });
    
                commit('setConversations', data);
            } catch (err) {
                console.error('Error fetch conversations:', err.response ? err.response.data : err);
            }
        },
        setChatMessages({ commit }, { conversationId, messages }) {
            messages.forEach(message => {
                commit('setChats', { conversationId, message });
            });
        },
        async fetchConversationById({ commit, state }, id){
            const conversation = state.conversations.find(conv => conv.id === id);
            commit('setSelectedConversation', conversation)
        },
        async sendMessage({ commit }, message) {
            try{
                commit('setChats', {
                    conversationId: message.conversationId,
                    message: {
                        from: message.from,
                        message: message.message
                    }
                })
            } catch (err) {
                console.error('Error al enviar el mensaje: ', err)
            }
        },
        selectConversation({ commit }, conversation) {
            commit('setSelectedConversation', conversation);
        },
        clearSelectedConversation({ commit }) {
            commit('clearSelectedConversation');
        },
        updateUserStatus({ commit }, status){
            commit('setUserOnline', status);
        },
        async createTicket({ commit }, cellphone) {
            try{
                const res = await axios.post(
                    'https://fe-sr-challenge.baymark.net/api/tickets',
                    {
                        cellphone: cellphone
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                if(res.status === 200) {
                    return { success: true, message: 'Ticket creado con éxito.', data: res.data }
                } else {
                    return { success: false, message: 'No se pudo crear el ticket.' }
                }
            } catch (err) {
                console.error('Error al crear el ticket:', err.response ? err.response.data : err);
                return { success: false, message: 'Error al crear el ticket.' };
            }
        }
    },
    getters: {
        getSelectedConversation(state) {
            return state.selectedConversation;
        },
        userStatus: (state) => {
            return state.isOnline
        },
        getChatMessages: (state) => (conversationId) => {
            return state.chats[conversationId] || [];
        }
    }
})