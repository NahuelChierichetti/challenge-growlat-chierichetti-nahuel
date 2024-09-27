<script setup>
import { onMounted, computed, ref } from 'vue';
import { useStore } from 'vuex';
import ConversationItem from './ConversationItem.vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const store = useStore();
const conversations = computed(() => store.state.conversations);
const showConversationList = ref(true);
const isDialogVisible = ref(false);
const inputDialog = ref('');
const toast = useToast();

onMounted(() => {
  store.dispatch('fetchConversations');
});

const selectConversation = (conversation) => {
  store.dispatch('selectConversation', conversation);

  if(window.innerWidth < 1024) {
    showConversationList.value = false;
  }
};

const showListAgain = () => {
  showConversationList.value = true;
  store.dispatch('clearSelectedConversation');
};

const openPopup = () => {
  isDialogVisible.value = true;
};

const saveTicket = async () => {
  if (inputDialog.value.trim()) {
    const result = await store.dispatch('createTicket', inputDialog.value);

    if (result.success) {
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Ticket creado correctamente', life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: result.message, life: 3000 });
    }

    isDialogVisible.value = false;
    inputDialog.value = '';
  } else {
    toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor ingresa un número de teléfono.', life: 3000 });
  }
};

</script>

<template>
  <div class="block lg:hidden p-2">
    <Button label="Nuevo ticket" icon="pi pi-ticket" class="w-full bg-green-500 border-green-500" @click="openPopup" />
  </div>
  <div v-if="showConversationList" class="container-conversations">
    <ConversationItem
      v-for="conversation in conversations" 
      :key="conversation.id"
      :firstname="conversation.firstname"
      :lastname="conversation.lastname"
      :email="conversation.email"
      :photo="conversation.photo"
      :id="conversation.id"
      :assignedPerson="conversation.assignedPerson"
      :lastMessage="conversation.lastMessage"
      :tag="conversation.tag"
      :timeAgo="conversation.timeAgo"
      :cellphone="conversation.cellphone"
      :status="conversation.status"
      :created_at="conversation.created_at"
      @click="selectConversation(conversation)"
    />
  </div>

  <div v-else class="flex justify-start p-2">
    <Button icon="pi pi-arrow-left" label="Volver a conversaciones" @click="showListAgain" link />
  </div>

  <Dialog header="Nuevo ticket" :visible="isDialogVisible" @update:visible="(val) => isDialogVisible = val" :modal="true" :closeOnEscape="true" :dismissableMask="false" class="h-auto w-11/12 md:w-1/3">
    <div class="p-fluid">
      <div class="field mb-4">
        <label for="inputText">Teléfono <span class="text-red-500">(*)</span></label>
        <InputText id="inputText" v-model="inputDialog" />
      </div>
    </div>
    <template #footer>
      <Button label="Enviar" icon="pi pi-arrow-right" iconPos="right" class="bg-blue-500 text-white" @click="saveTicket" />
    </template>
  </Dialog>
</template>

<style scoped>
.container-conversations {
  border-right: 1px solid #eee;
  height: auto;
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .container-conversations {
    width: 100%;
    height: 100vh;
    overflow-y: hidden;
  }
}
</style>