<template>
    <ion-header :translucent="true">
        <ion-toolbar class="ion-float-left">
            <ion-buttons>
                <ion-back-button default-href="/Todo" v-if="r_flag.value"></ion-back-button>
                <ion-title>{{r_title.value}}</ion-title>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup(props) {
        const r_title = ref(props.title)
        const r_flag = ref(props.flag)

        return{
            r_title,
            r_flag
        }
    },
    props:{
        title:{
            type:String
        },
        flag:{
            type:Boolean
        }
    }
})
</script>
