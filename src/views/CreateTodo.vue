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

        <div class="ion-padding-horizontal">
            <ion-item>
                <ion-label position="stacked">Todo</ion-label>
                <ion-input></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="stacked">説明</ion-label>
                <ion-input></ion-input>
            </ion-item>
            <ion-button @click="asd" expand="round" class="ion-float-right">作成</ion-button>
        </div>
        <img :src="img" class="ion-padding-horizontal">

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
        const img = ref("images/elephant_apng_zopfli.png")

        return{
            title,
            discription,
            todo,
            img
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
<style scoped>
div{
    --ion-padding: 10%;
}
</style>
