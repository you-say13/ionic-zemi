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
                <ion-label position="floating">Todo</ion-label>
                <ion-input  type="text" v-model="todo" minlength="1" maxlength="20"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating">説明</ion-label>
                <ion-textarea maxlength="100" v-model="desc" autoGrow="true"></ion-textarea>
            </ion-item>
            <p style="color: red;">{{msg}}</p>
            <ion-button @click="insert" expand="round" class="ion-float-right">作成</ion-button>
        </div>
        <img :src="img" class="ion-padding-horizontal">

    </ion-content>
</ion-page>
</template>
<script lang="ts">
import {useRouter} from 'vue-router';
import { 
    IonContent, 
    IonPage, 
    IonButton, 
    IonLabel,
    IonInput,
    IonItem,
    IonBackButton,
    IonTextarea
} from '@ionic/vue';
import { defineComponent, ref } from 'vue'
import ipaddress from '@/address'
import {useCookies} from "vue3-cookies"

export default defineComponent({
    setup(props) {
        
        const { cookies } = useCookies();
        const router = useRouter()
        const auth_info = ref()

        if(cookies.get("user_id") == undefined){
            router.push("/signin")
        }else{
            auth_info.value = atob(cookies.get('user_id'))
        }

        const title = ref(props.Title)
        const todo = ref()
        const desc = ref()
        const img = ref("images/elephant_apng_zopfli.png")
        const msg = ref()

        const insert = () =>{
            if(todo.value != null){
                console.log(todo.value)
                console.log(desc.value)
                const data = {
                    title:todo.value,
                    desc:desc.value,
                    user_id:auth_info.value
                }
                const addr = "http://"+ipaddress+"/zemi/insert"
                fetch(addr, {
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(data)
                })
                .then((response)=> response.json())
                .then((res) =>{
                    if(res.flag==1){
                        console.log("success:"+res.message)
                        alert(res.message)
                        todo.value = ""
                        desc.value = ""
                        router.push("/Todo")
                    }else{
                        alert("バグっとンな")
                        console.log("ここは通らないはず")
                    }
                })
                .catch((error)=>{
                    console.log("error:"+error)
                })
            }else{
                msg.value = "入力に不正があります"
            }
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
            back,
            msg
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
        IonBackButton,
        IonTextarea
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
