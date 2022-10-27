<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons>
                    <ion-back-button default-href="/Todo"></ion-back-button>
                    <ion-title>{{title}}</ion-title>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-text-center">
            <ion-item>
                <ion-label position="floating">Name</ion-label>
                <ion-input minlength="1" maxlength="20" v-model="user_info.Name.value"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating">Email</ion-label>
                <ion-input minlength="1" maxlength="30" v-model="user_info.Email.value"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating">Pass</ion-label>
                <ion-input minlength="1" maxlength="12" v-model="user_info.password.value"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating">Re.Pass</ion-label>
                <ion-input minlength="1" maxlength="12" v-model="user_info.Repassword.value"></ion-input>
            </ion-item>
            <ion-button @click="login" expand="round" class="ion-float-right">作成</ion-button>
        </ion-content>
    </ion-page>
</template>
<script lang="ts">
import {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
} from "@ionic/vue"
import { defineComponent, ref } from "@vue/runtime-core"
import { useRouter} from 'vue-router'

export default defineComponent({
    setup(props){
        const title = ref(props.Title);
        const router = useRouter()
        const user_info = ref({
            Name:String,
            Email:String,
            password:String,
            Repassword:String
        })
        const err = ref()

        const login = () =>{
            if(user_info.value.password == user_info.value.Repassword){
                
            }else{
                err.value="入力値が不正です"
            }
        }

        return{
            user_info,
            title,
            router
        }

    },
    props:{
        Title:{
            type:String
        }
    },
    components:{
        IonPage,
        IonContent,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonItem,
        IonLabel,
        IonInput,
        IonButton
    }
})
</script>