<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons>
                    <ion-button @click="logout" expand="round" class="ion-float-left">ログアウト</ion-button>
                    <ion-title>ToDo</ion-title>
                    <ion-button @click="intent" expand="round" class="ion-float-right">Todo追加</ion-button>
                </ion-buttons>            
            </ion-toolbar>
            <ion-toolbar>
                <ion-item>
                    <ion-radio-group allow-empty-selection v-model="comp_flag">
                        <ion-item lines="none">
                            <ion-item lines="none"> 
                                <ion-radio value=1></ion-radio>
                                <ion-label>既達</ion-label>
                            </ion-item>
                            <ion-item lines="none">
                                <ion-radio value=0></ion-radio>
                                <ion-label>未達</ion-label>
                            </ion-item>
                        </ion-item>
                    </ion-radio-group>
                </ion-item>
                <ion-item>
                    <ion-radio-group v-model="desc">
                        <ion-item lines="none">
                            <ion-item lines="none">
                                <ion-radio value="desc"></ion-radio>
                                <ion-label>降順</ion-label>
                            </ion-item>
                            <ion-item lines="none">
                                <ion-radio value="asc"></ion-radio>
                                <ion-label>昇順</ion-label>
                            </ion-item>
                        </ion-item>
                    </ion-radio-group>
                </ion-item>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <h1 class="ion-text-align">
            </h1>
            <ion-grid>
                <ion-row>
                    <ion-col size="12" v-for="(item, index) in todos" :key="item.todo_id">
                        <ion-card>
                            <ion-card-header>
                                <ion-card-subtitle v-if="item.flag">
                                    <p style="background-color:aqua; color:black;">{{map.get(item.flag)}}</p>
                                    {{item.date}}
                                </ion-card-subtitle>
                                <ion-card-subtitle v-else>
                                    <p style="background-color:orangered; color:black;">{{map.get(item.flag)}}</p>
                                    {{item.date}}
                                </ion-card-subtitle>
                                <ion-card-title>
                                    <ion-item lines="none">{{item.title}}</ion-item>
                                </ion-card-title>
                                <ion-card-content>
                                    <ion-item lines="none" style="color:gray;">{{item.todo}}</ion-item>
                                    <ion-label>
                                        <ion-buttons style="color: #1e90ff;" class="ion-float-center">
                                            <ion-button @click="fetch_del(item.todo_id, index)">削除</ion-button>
                                            <ion-button v-if="!item.flag" @click="fetch_upd(item.todo_id)">達成へ</ion-button>
                                            <ion-button v-else @click="fetch_upd(item.todo_id)">未達成へ</ion-button>
                                        </ion-buttons>
                                    </ion-label>
                                </ion-card-content>
                            </ion-card-header>
                        </ion-card>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>
<script lang="ts">
import { 
    IonButton,
    IonButtons,
    IonItem,
    IonContent, 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar, 
    IonLabel,
    IonRadio,
    IonRadioGroup,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonGrid,
    IonRow,
    IonCol,

} from '@ionic/vue';
import { defineComponent, ref, reactive, watch, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import ipaddress from '@/address'
import {useCookies} from "vue3-cookies"
import {ionic_alert} from './comp/alert_component'
import {fetch_component} from './comp/fetch_component'

export default defineComponent({
    props:{
        Title: String,
        flag:{
            type:Number,
            default: 0
        },
    },
    setup(props) {
        const title = ref(props.Title)
        const map = reactive(new Map([[0, "未達"],[1, "達成"]]))
        const search = ref("")
        const todos = ref()

        //各sort機能のflag変数
        //>>>>
        const comp_flag = ref()
        const desc = ref("desc")
        //<<<<
        const auth_info = ref()

        const router = useRouter()
        const route = useRoute()

        const { cookies } = useCookies();

        //cookieがセットされていない場合signinページへ飛ばすための分岐
        //>>>>
        if(cookies.get("user_id") == undefined){
            router.push("/signin")
        }else{
            auth_info.value = atob(cookies.get('user_id'))
        }
        //<<<<

        console.log(search.value)

        //fetch用の関数の定義
        const {upd, del, progress} = fetch_component() 

        const fetch_del = async(todo_id: number, id:number) =>{
            if(await ionic_alert("削除しますか？", "削除確認")){
                del(ipaddress, auth_info.value, todo_id)
                todos.value.splice(id, 1)
            }
        }

        const fetch_upd = async(todo_id: number) =>{
            if(await ionic_alert("達成状況を更新しますか？", "達成状況の更新")){
                upd(ipaddress, todo_id, comp_flag.value)
            } 
        }

        const fetch_prog = (flag: number) =>{
            progress(ipaddress, auth_info.value, desc.value, flag).then(res=>{
                todos.value = res
                console.log(res)
            })
        }

        //post通信を行う部分
        //その１：取得
        //>>>>
        const allfetch = async () =>{
            const url = "http://"+ipaddress+"/zemi/select"
            const data = {
                user_id : auth_info.value,
                desc : desc.value
            }
            await fetch(url, {
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            })
            .then(response => {
                return response.json()
            }).then(res =>{
                if(res.message == "error"){
                    alert("アクセス回数が多すぎます。少し時間をおいて下さい")
                }else{
                    todos.value = res
                }
            })
            .catch((error)=>{
                console.log("occurred error:" + error)
            })
        }

        //ここでcookieデータを削除しログアウトする
        const logout = async () =>{
            if(await ionic_alert("ログアウトしますか？", "ログアウト確認")){
                cookies.remove('user_id')
                if(cookies.get('user_id') == undefined){
                    router.push('/signin')
                }
            }else{
                console.log("キャンセルされました")
            }

        }

        //Todo作成後などライフサイクルに変化がないときにデータを再取得するための監視関数
        watch(route, () =>{
            //fetch_select()
        })
        //createTodoへの遷移用関数
        const intent = () =>{
            router.push("/createTodo")
        }

        watchEffect(() => {
            if(comp_flag.value == "1"){
                fetch_prog(1)
                console.log("fetch予定 comp")
            }else if(comp_flag.value == "0"){
                fetch_prog(0)
                console.log("fetch予定 uncomp")
            }else if(comp_flag.value == undefined && comp_flag.value == null){
                allfetch()
                console.log(comp_flag.value)
            }
        })

        return{
            title,
            map,
            todos,
            intent,
            comp_flag,
            desc,
            del,
            upd,
            allfetch,
            logout,
            search,
            progress,
            ionic_alert,
            fetch_del,
            fetch_upd,
            fetch_prog
        }
    },
    components:{
        IonContent,
        IonHeader,
        IonPage,
        IonTitle,
        IonToolbar,
        IonLabel,
        IonButton,
        IonButtons,
        IonItem,
        IonRadio,
        IonRadioGroup,
        IonCard,
        IonCardContent,
        IonCardHeader,
        IonCardTitle,
        IonCardSubtitle,
        IonGrid,
        IonRow,
        IonCol,
    }
})
</script>
<style>
ion-title{
    text-align: center;
}
</style>
