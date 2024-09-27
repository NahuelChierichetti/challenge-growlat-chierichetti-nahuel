<script setup>
import { defineProps, watch, ref, computed } from 'vue';
import Chip from 'primevue/chip';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import { useStore } from 'vuex';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InputText from 'primevue/inputtext';
import IconConVos from '../assets/imgs/icon-user.png';

const props = defineProps({
  selectedConversation: Object,
  conversations: Object
});

const store = useStore();

watch(() => props.selectedConversation, async (newValue) => {
  if (newValue) {
    const existingMessages = store.getters.getChatMessages(newValue.id);
    if (existingMessages.length === 0) {
      const messages = store.getters.getChatMessages(newValue.id);
      store.dispatch('setChatMessages', { conversationId: newValue.id, messages });
    }
  }
});

const messages = computed(() => store.getters.getChatMessages(props.selectedConversation.id));

const textMessage = ref('')

const sendMessage = () => {
  const message = {
    from: 'convos',
    message: textMessage.value,
    conversationId: props.selectedConversation.id
  };
  store.dispatch('sendMessage', message);
  textMessage.value = '';
};

const clearConversation = () => {
  store.dispatch('clearSelectedConversation');
};
</script>

<template>
    <div v-if="selectedConversation" class="chat-area flex flex-col lg:flex-row h-full">
        <div class="w-full lg:w-2/3 flex flex-col conversation">
            <div class="bar-info-top h-[20vh] lg:h-20 flex bg-white justify-between lg:items-center p-3 border-b border-gray-200 lg:border-r flex-col lg:flex-row">
                <div class="flex items-center">
                    <Avatar 
                        v-if="selectedConversation.photo"
                        :image="selectedConversation.photo" 
                        class="h-10 w-10 mr-4" shape="circle" size="large" 
                    />
                    <div class="user-info">
                        <h2 class="text-lg font-semibold"> 
                            {{ selectedConversation.firstname }} {{ selectedConversation.lastname }}
                        </h2>
                        <p class="text-sm text-gray-500"> 
                            Operadores: 
                            <span class="bg-gray-50 border border-gray-200 py-1 px-2 rounded-md text-gray-600 text-sm font-semibold">
                                {{ selectedConversation.assignedPerson }}
                            </span>
                        </p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <Button label="Transferir" severity="secondary" raised class="!bg-white !text-gray-700 !border-gray-300" />
                    <Button label="Desasignarme" severity="secondary" raised class="!bg-white !text-gray-700 !border-gray-300" />
                    <Button label="Finalizar" raised class="!bg-gray-800 !text-white !border-gray-800" />
                    <i class="pi pi-times !text-xl text-gray-400 cursor-pointer" @click="clearConversation"></i>
                </div>
            </div>
            <div class="conversation-area p-4 overflow-auto flex-grow">
                <div v-for="(msg, index) in messages" :key="index" class="flex mb-4" :class="{'flex-row-reverse': msg.from === 'convos'}">
                    <Avatar :image="msg.from === 'user' && selectedConversation.photo ? selectedConversation.photo : IconConVos" class="h-10 w-10" shape="circle" size="large" />
                    <p :class="msg.from === 'user' ? 'user-message' : 'convos-message'" class="ml-2 text-sm bg-white p-2 rounded-lg shadow-md max-w-md">
                        {{ msg.message }}
                    </p>
                </div>
            </div>

            <div class="conversation-actions p-4 border-t border-gray-200 bg-white">
                <div class="flex flex-col lg:flex-row items-center lg:space-x-3 space-y-4 lg:space-y-0">
                    <div class="icons-chat flex space-x-4 text-gray-400 w-full lg:w-auto">
                        <i class="pi pi-face-smile"></i>
                        <i class="pi pi-comment"></i>
                        <i class="pi pi-user-plus"></i>
                        <i class="pi pi-upload"></i>
                        <i class="pi pi-sparkles"></i>
                    </div>

                    <div class="flex w-full space-x-3">
                        <div class="w-full">
                            <InputText v-model="textMessage" placeholder="Escribe aquí tu mensaje" class="w-full" />
                        </div>
                        <Button icon="pi pi-send" @click="sendMessage" aria-label="Enviar" class="bg-white border-gray-200 text-gray-400" />
                    </div>
                </div>
            </div>
        </div>
        
        <div class="options-right hidden lg:block w-full lg:w-1/3 bg-white flex flex-col overflow-auto border-t lg:border-t-0 lg:border-l border-gray-200">
            <div class="p-4 flex items-center space-x-4 border-b border-gray-200">
                <Avatar :image="selectedConversation.photo" class="h-10 w-10" shape="circle" size="large" />
                <div>
                    <h2 class="text-lg font-semibold">{{ selectedConversation.firstname }} {{ selectedConversation.lastname }}</h2>
                    <p class="text-sm text-gray-500">Id: #{{ selectedConversation.id }}</p>
                </div>
            </div>
            <div class="options-ticket flex flex-col py-4 px-3">
                <div class="flex justify-between">
                    <p class="text-[#6b7382] font-normal">
                        Ticket
                    </p>
                    <Button label="Mostrar historial" link class="p-0 text-[14px] text-[#3AA8F3]"/>
                </div>
                <div class="border border-[#eeeeee] rounded-lg box-ticket mt-2">
                    <p class="py-2 px-2 border-b border-[#eeeeee]">
                        <span class="text-[#6b7382] font-medium text-[14px]">Baneja de entrada:</span> 
                            <span class="text-[13px]">
                                {{ selectedConversation.tag }}
                            </span>
                    </p>
                    <p class="py-2 px-2 border-b border-[#eeeeee]">
                        <span class="text-[#6b7382] font-medium text-[14px]">Id:</span> <span class="text-[13px]">
                            #{{ selectedConversation.id }}
                        </span>
                    </p>
                    <p class="py-2 px-2 border-b border-[#eeeeee]">
                        <span class="text-[#6b7382] font-medium text-[14px]">Creado:</span> 
                            <span class="text-[13px]">
                                {{ selectedConversation.timeAgo }}
                            </span>
                    </p>
                    <p class="py-2 px-2 border-b border-[#eeeeee]">
                        <span class="text-[#6b7382] font-medium text-[14px]">Diálogo:</span> 
                        <span class="text-[13px]">
                            # {{ selectedConversation.dialog ? selectedConversation.dialog : '-' }}
                        </span>
                    </p>
                    <p class="py-2 px-2"><span class="text-[#6b7382] font-medium text-[14px]">Etiquetas:</span> 
                        <span class="text-[13px] bg-gray-200 ml-2 py-1 px-3 rounded-md font-semibold">
                            {{ selectedConversation.label ? selectedConversation.label : 'Sin tags' }}
                        </span>
                    </p>
                </div>
                <div class="tabs-ticket mt-4">
                    <TabView>
                        <TabPanel header="Contacto">
                            <div class="flex justify-between gap-2">
                                <Button 
                                    label="Editar" 
                                    severity="secondary" 
                                    raised 
                                    class="!bg-white text-[14px] !shadow-none !text-[#374152] w-[50%] !border-1 !border-[#D1D5b5] rounded-md"
                                />
                                <Button 
                                    label="Refrescar" 
                                    severity="secondary" 
                                    raised 
                                    class="!bg-white text-[14px] !shadow-none !text-[#374152] w-[50%] !border-1 !border-[#D1D5b5] rounded-md"
                                />
                            </div>
                            <div class="border border-[#eeeeee] rounded-lg box-ticket mt-4">
                                <p class="py-2 px-2 border-b border-[#eeeeee]">
                                    <span class="text-[#6b7382] font-medium text-[14px]">ID: </span> 
                                        <span class="text-[13px]">
                                            {{ selectedConversation.id }}
                                        </span>
                                </p>
                                <p class="py-2 px-2 border-b border-[#eeeeee]">
                                    <span class="text-[#6b7382] font-medium text-[14px]">Teléfono: </span> <span class="text-[13px]">
                                        {{ selectedConversation.cellphone }}
                                    </span>
                                </p>
                                <p class="py-2 px-2 border-b border-[#eeeeee]">
                                    <span class="text-[#6b7382] font-medium text-[14px]">Nombre: </span> 
                                    <span class="text-[13px]">
                                        {{ selectedConversation.firstname }} {{ selectedConversation.lastname }}
                                    </span>
                                </p>
                                <p class="py-2 px-2 border-b border-[#eeeeee]"><span class="text-[#6b7382] font-medium text-[14px]">Etiquetas:</span> 
                                    <span class="text-[13px] bg-gray-200 ml-2 py-1 px-3 rounded-md font-semibold">
                                        {{ selectedConversation.label ? selectedConversation.label : 'Sin tags' }}
                                    </span>
                                </p>
                                <p class="py-2 px-2 border-b border-[#eeeeee]">
                                    <span class="text-[#6b7382] font-medium text-[14px]">Estado: </span> 
                                    <span 
                                        class="text-[13px] px-2 py-1 rounded"
                                        :class="selectedConversation.status === 'active' ? 'bg-[#E6FDEE] text-[#45BB5F] font-medium' : 'bg-red-200 text-red-700 font-medium'"
                                    >
                                        <template v-if="selectedConversation.status === 'active'">
                                            <i class="pi pi-circle-fill text-[10px]"></i> Suscripto
                                        </template>
                                        <template v-else>
                                            <i class="pi pi-circle-fill text-[10px] text-red-700"></i> Sin suscripción
                                        </template>
                                    </span>
                                </p>
                                <p class="py-2 px-2 border-b border-[#eeeeee]">
                                    <span class="text-[#6b7382] font-medium text-[14px]">Fecha de creación: </span> 
                                        <span class="text-[13px]">
                                            {{ selectedConversation.creationDate }}
                                        </span>
                                </p>
                                <p class="py-2 px-2 border-b border-[#eeeeee]">
                                    <span class="text-[#6b7382] font-medium text-[14px]">Última actualización: </span> 
                                    <span class="text-[13px]">
                                        {{ selectedConversation.updatedDate }}
                                    </span>
                                </p>
                                <p class="py-2 px-2 border-b border-[#eeeeee]">
                                    <span class="text-[#6b7382] font-medium text-[14px]">Fuente: </span> 
                                    <span class="text-[13px] font-medium text-[#6b7382]">
                                        WhatsApp
                                    </span>
                                </p>
                                <p class="py-2 px-2"><span class="text-[#6b7382] font-medium text-[14px]">Fecha de Suscripción: </span> 
                                    <span class="text-[13px]">
                                        {{ selectedConversation.suscriptionDate }}
                                    </span>
                                </p>
                            </div>
                        </TabPanel>
                        <TabPanel header="Adjuntos">
                            <p class="m-0">
                                Adjuntos
                            </p>
                        </TabPanel>
                        <TabPanel header="Feed">
                            <p class="m-0">
                                Feed
                            </p>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    </div>
    <div 
        v-else 
        class="chat-area flex items-center justify-center"
    >
        <Chip 
            label="Selecciona un contacto" 
            icon="pi pi-users" 
            class="bg-white px-4 py-1 rounded-[30px] border-1 border-[#f9f9f9] font-normal" 
        />
    </div>
</template>

<style scoped>
.conversation {
    height: calc(100vh - 4rem);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.chat-area {
    background-color: #EEEAE2;
    background-image: url('../assets/imgs/trama-bg-wsp.png');
    background-position: center;
    background-size: contain;
    min-height: calc(100vh - 4rem);
}
.conversation-actions{
    height: 15vh;
    background: #fff;
    border-top: 1px solid #eee;
    border-right: 1px solid #eee;
    border-left: 1px solid #eee;
}
.bar-info-top {
    max-height: 77px;
    border-bottom: 1px solid #eee;
    overflow: hidden;
}
.conversation-area{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
}

.options-right {
    overflow-y: auto;
}

.box-ticket{
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.07);
}

.container-chat{
    display: flex;
    margin: 10px 0 20px;
}

p.user-message{
    background: #FFF;
    max-width: 70%;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    margin-left: 10px;
}

p.convos-message {
    background: #D9FED3;
    padding: 10px;
    max-width: 70%;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    margin-right: 10px;
}

@media screen and (max-width: 1024px){
    .bar-info-top {
        max-height: max-content !important;
        border-bottom: 1px solid #eee;
        padding-bottom: 100px;
        gap: 10px;
    }
    
}

</style>