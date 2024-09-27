import { createRouter, createWebHistory } from "vue-router";
import Conversations from '../views/Conversations.vue';

const routes = [
    {
        path: '/',
        name: 'Conversations',
        component: Conversations,
    },
    
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;