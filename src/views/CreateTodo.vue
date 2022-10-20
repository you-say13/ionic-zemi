<template>
<ion-page>
        <ion-header :translucent="true">
        <ion-toolbar class="ion-float-left">
            <ion-buttons>
                <ion-back-button default-href="/Todo"></ion-back-button>
                <ion-title>{{title}}</ion-title>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
        <div class="ion-padding-horizontal">
            <ion-item>
                <ion-label position="stacked">Todo</ion-label>
                <ion-input v-model="todo"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="stacked">説明</ion-label>
                <ion-input v-model="desc"></ion-input>
            </ion-item>
            
            <ion-button @click="insert" expand="round" class="ion-float-right">作成</ion-button>
        </div>
        <img :src="img" class="ion-padding-horizontal">

    </ion-content>
</ion-page>
</template>
<script lang="ts">
import router from '@/router';
import { 
    IonContent, 
    IonPage, 
    IonButton, 
    IonLabel,
    IonInput,
    IonItem,
} from '@ionic/vue';
import axios from 'axios';
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup(props) {
        const title = ref(props.Title)
        const todo = ref()
        const desc = ref()
        const img = ref("images/elephant_apng_zopfli.png")

        const insert = () =>{
            console.log(todo)
            console.log(desc)
            axios.post("http://10.16.10.61:3000/zemi/insert", {
                Todo:todo.value,
                Desc:desc.value
            })
            .then((response) =>{
                console.log(response)
                router.push("Todo")
            })
            .catch((error)=>{
                console.log(error)
            })
        }

        const back = () =>{
            router.push("Todo");
        }

        return{
            title,
            desc,
            todo,
            img,
            insert,
            back
        }
    },
    props:{
        Title:String
    },
    components:{
        IonContent, 
        IonPage, 
        IonButton, 
        IonLabel,
        IonInput,
        IonItem,
    }
})
</script>
<style scoped>
div{
    --ion-padding: 10%;
}
ion-title{
    text-align: center;
}
</style>
