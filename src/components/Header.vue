<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import Menubar from 'primevue/menubar';

const store = useStore();
const isOnline = computed (() => store.state.isOnline);

const items = ref([
    {
        label: 'Inicio',
        icon: 'pi pi-home',
    },
    {
        label: 'Audiencia',
        icon: 'pi pi-users',
    },
    {
        label: 'Conversaciones',
        icon: 'pi pi-comments',
        active: true,
    },
    {
        label: 'Diálogos',
        icon: 'pi pi-comment',
    },
    {
        label: 'Campañas',
        icon: 'pi pi-megaphone',
    }
]);

</script>

<template>
    <Menubar :model="items" class="bg-white">
        <template #start>
            <img src="../assets/imgs/logo-convos.png" alt="Convos" class="h-[1.7em] w-auto mr-4">
        </template>
        <template #item="{ item, props }">
            <a v-ripple class="flex items-center mx-3 !h-[4rem]" v-bind="props" :class="{'menu-active' : item.active}">
                <span :class="item.icon" class="mr-0 text-[#6C7280] font-medium"></span>
                <span class="ml-1 text-[#6C7280] font-medium">{{ item.label }}</span>
            </a>
        </template>
        <template #end>
            <div class="flex items-center gap-2">
                <div class="status online flex items-center" :class="isOnline ? 'conect' : 'disconect'">
                    <i class="pi pi-user"></i>
                    <div class="badge-state" :class="isOnline ? 'status-online' : ''"></div>
                    <span v-if="isOnline" class="ms-1 hidden md:block">En línea</span>
                    <span v-else class="ms-1 hidden md:block">Offline</span>
                </div>
                <div class="actions hidden md:flex">
                    <i class="pi pi-calendar mx-3 text-[#6C7280] font-medium"></i>
                    <i class="pi pi-wave-pulse mx-3 text-[#6C7280] font-medium"></i>
                </div>
                <div class="user flex items-center">
                    <img src="../assets/imgs/icon-user.png" alt="icon-user" class="h-[35px] w-[35px]">
                    <div class="flex flex-col gap-0 mx-3 hidden md:block">
                        <p class="font-bold text-[14px]">Renzo</p>
                        <p class="font-light text-[13px] text-[#6c7280]">Convos develop</p>
                    </div>
                    <i class="pi pi-angle-down text-[#6c7280] font-medium text-[14px]"></i>
                </div>
            </div>
        </template>
    </Menubar>
</template>

<style scoped>
.p-menubar.p-component {
    padding: 0 30px;
    height: 4rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #E9E9EA;
}
.menu-active span {
    color: #000;
}
.menu-active {
    border-bottom: 2px solid #5BB7F5;
}
.p-menubar-item-link:hover > span {
    color: #000;
    transition: .3s ease-in-out;
}
.status.online {
    display: flex;
    align-items: end;
}
.badge-state {
    height: 7px;
    width: 7px;
    background-color: rgb(221, 26, 26);
    border-radius: 50%;
}
.badge-state.status-online{
    background: #21C55E;
}
.status.online.conect {
    background: #E9FCEF;
    padding: 8px 12px;
    border-radius: 15px;
    color: #176534;
}
.status.online.disconect {
    background: #fccccc;
    padding: 8px 12px;
    border-radius: 15px;
    color: #651717;
}
</style>
