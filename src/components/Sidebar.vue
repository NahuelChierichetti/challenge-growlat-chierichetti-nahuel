<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const isDialogVisible = ref(false);
const inputDialog = ref('');
const store = useStore();
const toast = useToast();

const openPopup = () => {
    isDialogVisible.value = true;
}

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
}

const itemsMenuSup = ref([
    {
        label: 'Mi bandeja',
        icon: 'pi pi-user',
        totalResult: 1
    },
    {
        label: 'No asignado',
        icon: 'pi pi-ban',
        totalResult: 0
    },
    {
        label: 'Todo',
        icon: 'pi pi-users',
        active: true,
        totalResult: 3
    }
]);

const itemsMenuInf = ref([
    {
        label: 'Conversaciones',
        icon: 'pi pi-comment'
    },
    {
        label: 'Atajos',
        icon: 'pi pi-window-maximize'
    },
    {
        label: 'Bandejas de entradas',
        icon: 'pi pi-inbox'
    },
    {
        label: 'Tickets',
        icon: 'pi pi-ticket'
    },
    {
        label: 'Rendimiento',
        icon: 'pi pi-ticket'
    }
])
</script>

<template>
    <div class="py-4 px-2 bg-[#1F2937] text-white h-[calc(100vh-4rem)] flex flex-col justify-between">
        <div class="options-sup flex flex-col justify-between">
            <div class="flex justify-between mb-4">
                <div class="inbox flex items-center gap-2 px-4">
                    <i class="pi pi-inbox text-white text-[1.3em]"></i>
                    <p class="text-white font-medium text-[1.3em]">Inbox</p>
                </div>
                <div class="flex items-center gap-2 px-4">
                    <i class="pi pi-filter text-[#696F7D] font-medium"></i>
                    <i class="pi pi-sync text-[#696F7D] font-medium"></i>
                </div>
            </div>

            <div class="flex flex-col gap-2 mb-4">
                <div v-for="(item, index) in itemsMenuSup" :key="index" class="item-submenu flex items-center gap-2 cursor-pointer py-1 px-3 rounded-lg hover:bg-[#111827]" :class="item.active ? 'active' : ''">
                    <i :class="item.icon" class="text-[#696F7D] text-[1.2em]"></i>
                    <span class="ml-2 text-[#696F7D] font-medium">{{ item.label }}</span>
                    <span class="ml-auto badge text-[#696F7D] py-1 text-s font-normal">{{ item.totalResult }}</span>
                </div>
            </div>

            <div class="container-new-ticket">
                <Button label="Nuevo ticket" @click="openPopup" icon="pi pi-ticket" class="btn-ticket w-full !bg-[#45BB5F] !p-2 !rounded-md flex !justify-center text-center !gap-2 font-bold text-[14px] items-center border-[#45BB5F]" />
            </div>
        </div>

        <div class="options-inf flex flex-col justify-between">
            <div class="flex flex-col gap-2 mb-4 pb-4 border-b border-[#696F7D]">
                <div v-for="(item, index) in itemsMenuInf" :key="index" class="item-submenu-inf flex items-center gap-2 cursor-pointer py-1 px-3 rounded-lg hover:bg-[#111827]">
                    <i :class="item.icon" class="text-[#696F7D] text-[1.2em]"></i>
                    <span class="ml-2 text-[#696F7D] font-normal">{{ item.label }}</span>
                </div>
            </div>
            <div class="container-ocultar-sidebar">
                <Button label="Ocultar Sidebar" icon="pi pi-angle-left" class="w-full !bg-[transparent] !border-[transparent] !hover:border-[#fff] !p-2 !rounded-md flex flex-row-reverse !gap-2 font-light !text-[14px] !text-[#696F7D] hover:!text-white" />
            </div>
        </div>
    </div>

    <Dialog 
        header="Nuevo ticket" 
        :visible="isDialogVisible" 
        @update:visible="(val) => isDialogVisible = val"
        :modal="true" 
        :closeOnEscape="true" 
        :dismissableMask="false"
        class="h-[30vh] bg-white w-[90%] md:w-[30vw] flex flex-col justify-around rounded-5xl"
    >
        <div class="p-fluid">
            <div class="field mb-10">
                <label for="inputText">Teléfono <span class="text-red-500">(*)</span></label>
                <InputText id="inputText" v-model="inputDialog" />
            </div>
        </div>
        <template #footer>
            <Button label="Enviar" icon="pi pi-arrow-right" iconPos="right" class="p-button-text rounded-lg !bg-[#3AA8FB] !text-white" @click="saveTicket" />
        </template>
    </Dialog>

    <Toast />
</template>

<style scoped>
.badge {
    display: inline-block;
}
.item-submenu.active {
    background: #111827;
}
.item-submenu.active > span {
    color: #fff;
}
.item-submenu.active > i {
    color: #fff;
}
.item-submenu-inf:hover > span {
    color: #fff;
    transition: .2s ease-in;
}
.item-submenu-inf:hover > i {
    color: #fff;
    transition: .2s ease-in;
}
.item-submenu-inf {
    transition: .2s ease-in;
}
</style>