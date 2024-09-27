<script setup>
import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue';
import ContactSearch from '../components/ContactSearch.vue';
import ConversationList from '../components/ConversationList.vue'
import ChatArea from '../components/ChatArea.vue';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const selectedConversation = computed(() => store.state.selectedConversation);
</script>

<template>
    <Header />
    <div class="flex flex-col md:flex-row">
        <div class="sidebar hidden md:block md:w-[14%]">
            <Sidebar />
        </div>

        <div class="md:w-[18%] w-full">
            <ContactSearch />
            <ConversationList />
        </div>

        <div class="md:w-[68%] w-full">
            <ChatArea :selectedConversation="selectedConversation" />
        </div>
    </div>
</template>

<style scoped>
</style>