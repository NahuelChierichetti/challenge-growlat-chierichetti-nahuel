<script setup>
import { defineProps } from 'vue';
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge';

const props = defineProps({
    firstname: String,
    lastname: String,
    email: String,
    photo: String,
    id: Number,
    assignedPerson: String,
    lastMessage: String,
    timeAgo: String,
    tag: String
});
</script>

<template>
    <div class="p-4 card-conversation flex flex-col border-t border-[#EEEEEE] hover:bg-[#FEF9C3] hover:ease-out">
        <div class="flex items-center">
            <div class="flex items-end">
                <Avatar :image="photo" class="!h-[40px] !w-[40px]" shape="circle" size="large" />
                <i class="pi pi-whatsapp bg-[#20A512] text-white rounded-3xl ml-[-10px] mr-3"></i>
            </div>
            <div class="flex justify-between w-[100%]">
                <div class="flex flex-col">
                    <p class="text-[14px] font-medium text-[#282828]">{{ firstname }} {{ lastname }}</p>
                    <div class="flex items-center gap-1">
                        <i class="pi pi-desktop text-[#98abba] text-[12px] font-semibold"></i>
                        <span class="text-[#98abba] text-[14px]">Template</span>
                    </div>
                </div>
                <div class="flex">
                    <p class="text-[12px] font-light text-[#98abba]">{{timeAgo}}</p>
                </div>
            </div>
        </div>
        <div class="flex w-[100%] mt-3 gap-2">
            <span class="bg-[#fff] border-[1px] border-[#e8eaed] py-1 px-4 rounded-[8px] text-black text-[12px] font-semibold">{{ lastMessage }}</span>
            <span class="bg-[#fff] border-[1px] border-[#e8eaed] py-1 px-4 rounded-[8px] text-black text-[12px] font-semibold"><Badge class="bg-[#104FD1] mr-2" size="small"></Badge>{{ tag }}</span>
            <span class="bg-[#fff] border-[1px] border-[#e8eaed] py-1 px-4 rounded-[8px] text-black text-[12px] font-semibold"><span class="pi pi-user text-[12px] mr-2"></span>{{ assignedPerson }}</span>
        </div>
    </div>
</template>

<style scoped>
.card-conversation{
    cursor: pointer;
}
</style>