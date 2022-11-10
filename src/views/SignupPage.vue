<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons>
                    <ion-title>{{title}}</ion-title>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class=" ion-padding-horizontal">
            <ion-item>
                <ion-label position="floating">Name</ion-label>
                <ion-input minlength="1" maxlength="20" v-model="name"></ion-input>
            </ion-item>
            <div class="error">{{errors.name}}</div>
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
            <ion-item>
                <ion-label position="floating">Re.Pass</ion-label>
                <ion-input type="password" minlength="1" maxlength="12" v-model="repass"></ion-input>
            </ion-item>
            <div class="error">{{errors.repass}}</div>
            <ion-button v-if="meta.valid" @click="signup" expand="round" class="ion-float-right">作成</ion-button>
            <ion-button v-else @click="valid_alert" expand="round" class="ion-float-right">作成</ion-button>
            <a href="/signin">ログイン画面へ</a>
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
import * as yup from 'yup';
import ipaddress from '@/address'
import {useCookies}from "vue3-cookies"

export default defineComponent({
    setup(props){
        const title = ref(props.Title);

        //ルーターから無理やり遷移するときに使う
        const router = useRouter()

        const {cookies} = useCookies()
        
        if(cookies.get("user_id") == undefined){
            console.log("ok")
        }else{
            router.push("/todo")
        }

        //vee validation用 制限の内容
        const setting = yup.object({
            name: yup.string().required('必須項目です').min(1).max(20),
            email: yup.string().required('必須項目です').email('メールアドレスの形式で入力してください').max(30),
            pass: yup.string().required('必須項目です').min(6).max(12),
            repass: yup.string().oneOf([yup.ref('pass'), 'パスワードと違いがあります']).min(6).max(12)
        })

        //vee validation用
        //errors：settingに引っかかった、
        //        inputのerrorを持つ
        //meta: settingに引っかかったかどうかをboolean型で返す(dirty, valid等)
        const { errors, meta } = useForm({
            validationSchema: setting,
            initialValues:{
                name:'',
                email:'',
                pass:'',
                repass:'',
            }
        })

        //vee validation用 監視対象を選択する
        const {value:name} = useField('name');
        const {value:email} = useField('email');
        const {value:pass} = useField('pass');
        const {value:repass} = useField('repass');

        //signupメソッド：新規登録用のデータをサーバに送り、返り値を待つ
        const signup = () =>{

            console.log('pass signup')

            const addr = "http://"+ipaddress+"/zemi/signup?name="+name.value+"&email="+email.value+"&pass="+pass.value+""
            fetch(addr)
            .then((res)=>res.json())
            .then((response)=>{
                if(response.flag == 1){
                    alert("ユーザ登録完了!")
                    router.push("/signin")
                }else{
                    alert("不正な入力が送られました、攻撃を停止してください")
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
            signup,
            name,
            email, 
            pass, 
            repass,
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
