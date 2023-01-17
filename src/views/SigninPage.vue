<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons>
                    <ion-title>{{title}}</ion-title>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding-horizontal">
            <form>
                <ion-item>
                    <ion-label position="floating">Name</ion-label>
                    <ion-input minlength="1" maxlength="30" v-model="name"></ion-input>
                </ion-item>
                <div class="error">{{errors.name}}</div>
                <ion-item>
                    <ion-label position="floating">Pass</ion-label>
                    <ion-input type="password" minlength="1" maxlength="12" v-model="pass"></ion-input>
                </ion-item>
                <div class="error">{{errors.pass}}</div>
                <ion-button v-if="meta.valid" @click="signin" expand="round" class="ion-float-right">サインイン</ion-button>
                <ion-button v-else @click="valid_alert" expand="round" class="ion-float-right">サインイン</ion-button>
                <a href="/signup">新規登録</a>
            </form>
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
    IonTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
} from "@ionic/vue"
import { defineComponent, onBeforeMount, ref } from "@vue/runtime-core"
import { useRouter } from 'vue-router'
import { useField, useForm } from 'vee-validate'
import { object, string } from 'yup';
import ipaddress from '@/address'
import { useCookies } from "vue3-cookies";
import crypto from "crypto-js"

export default defineComponent({
    setup(props){

        //ルーターから無理やり遷移するときに使う
        const router = useRouter()
        const { cookies } = useCookies();

        onBeforeMount(()=>{
            if(cookies.get("user_id") == undefined){
                console.log("ok")
            }else{
                router.push({name:"todo", params: {title: "Todo"}})
            }
        })

        const title = ref(props.Title);

        //vee validation用 制限の内容
        const setting = object({
            name: string().required('必須項目です').min(1).max(20),
            pass: string().required('必須項目です').min(6).max(12),
        })

        //vee validation用
        //errors：settingに引っかかった、
        //        inputのerrorを持つ
        //meta: settingに引っかかったかどうかをboolean型で返す(dirty, valid等)
        const { errors, meta } = useForm({
            validationSchema: setting,
            initialValues:{
                name:'',
                pass:'',
            }
        })

        //vee validation用 監視対象を選択する

        const {value:name} = useField('name');
        const {value:pass} = useField<string>('pass');


        //signinメソッド：ログイン用のデータをサーバに送り、返り値を待つ
        const signin = () =>{
            if(cookies.get("user_id") != undefined){
                alert("既にログインしています")
                router.push({name:"todo", params: {title: "Todo"}})
            }
            const mes = crypto.SHA256(pass.value).toString()
            const basic_a : string = name.value+":"+mes
            const auth : string = btoa(unescape(encodeURIComponent(basic_a)))
            const addr = "http://"+ipaddress+"/zemi/signin"
            fetch(addr, {
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':auth,
                },
            })
            .then((res)=>res.json())
            .then((data)=>{
                if(data.flag==0 || data.flag == -1){
                    alert(data.message)
                    return
                }else{
                    const id = btoa(data.id)
                    cookies.set('user_id', id, 60*60*24*7, "/")
                    pass.value = ""
                    name.value = ""
                    alert(data.message)
                    router.push("/todo")
                }
            })
            .catch(console.error)
        }

        const valid_alert = () =>{
            alert('入力に不正があります')
        }

        return{
            title,
            router,
            signin,
            name, 
            pass, 
            errors,
            meta,
            valid_alert
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
        IonTitle,
        IonItem,
        IonLabel,
        IonInput,
        IonButton
    }
})
</script>
<style>
*{
    --ion-padding: 10%;
}
.error{
    color: red;
}
</style>
