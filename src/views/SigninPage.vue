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
            <ion-item>
                <ion-label position="floating">Email</ion-label>
                <ion-input minlength="1" maxlength="30" v-model="email"></ion-input>
            </ion-item>
            <div class="error">{{errors.email}}</div>
            <ion-item>
                <ion-label position="floating">Pass</ion-label>
                <ion-input type="password" minlength="1" maxlength="12" v-model="pass"></ion-input>
            </ion-item>
            <div class="error">{{errors.pass}}</div>
            <ion-button v-if="meta.valid" @click="signin" expand="round" class="ion-float-right">サインイン</ion-button>
            <ion-button v-else @click="valid_alert" expand="round" class="ion-float-right">サインイン</ion-button>
            <a href="/signup">新規登録</a>
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
import { defineComponent, ref } from "@vue/runtime-core"
import { useRouter} from 'vue-router'
import { useField, useForm } from 'vee-validate'
import { object, string } from 'yup';
import ipaddress from '@/address'
import { useCookies } from "vue3-cookies";

export default defineComponent({
    setup(props){

        //ルーターから無理やり遷移するときに使う
        const router = useRouter()

        const { cookies } = useCookies();

        if(cookies.get("user_id") == undefined){
            console.log("ok")
        }else{
            router.push("/todo")
        }

        const title = ref(props.Title);

        //vee validation用 制限の内容
        const setting = object({
            email: string().required('必須項目です').email('メールアドレスの形式で入力してください').max(30),
            pass: string().required('必須項目です').min(6).max(12),
        })

        //vee validation用
        //errors：settingに引っかかった、
        //        inputのerrorを持つ
        //meta: settingに引っかかったかどうかをboolean型で返す(dirty, valid等)
        const { errors, meta } = useForm({
            validationSchema: setting,
            initialValues:{
                email:'',
                pass:'',
            }
        })

        //vee validation用 監視対象を選択する

        const {value:email} = useField('email');
        const {value:pass} = useField('pass');


        //signinメソッド：ログイン用のデータをサーバに送り、返り値を待つ
        const signin = () =>{
            const addr = "http://"+ipaddress+"/zemi/signin?email="+email.value+"&pass="+pass.value+"";
            fetch(addr)
            .then((res)=>res.json())
            .then((data)=>{
                console.log(data.string)
                if(data.string=="内容に間違いがあります"){
                    alert(data.string)
                    return
                }else{
                    cookies.set('user_id', data.id, 60*60*24*7, "/")
                    console.log("set cookie is "+data.id)
                    alert(cookies.get('user_id'))
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
            email, 
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
