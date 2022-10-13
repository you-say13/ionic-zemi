<template>
<ion-page>
    <ion-header :translucent="true">
        <ion-toolbar>
            <ion-title>{{title}}</ion-title>
        </ion-toolbar>
        </ion-header>
    <ion-content :fullscreen="true">
        <ion-header collapse="condense">
            <ion-toolbar>
            <ion-title size="large">{{title}}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-item>
            <ion-label position="floationg"></ion-label>
        </ion-item>
        <ion-input></ion-input>

        <ion-button @click="asd" class="ion-float-right"></ion-button>

    </ion-content>
</ion-page>
</template>
<script lang="ts">
import { 
    IonContent, 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar, 
    IonButton, 
    IonLabel,
    IonInput,
    IonItem,
} from '@ionic/vue';
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup(props) {
        const title = ref(props.Title)
        const todo = ref(String)
        const discription = ref(String)
        return{
            title,
            discription,
            todo
        }
    },
    props:{
        Title:String
    },
    components:{
        IonContent, 
        IonHeader, 
        IonPage, 
        IonTitle, 
        IonToolbar, 
        IonButton, 
        IonLabel,
        IonInput,
        IonItem,
    }
})
</script>
