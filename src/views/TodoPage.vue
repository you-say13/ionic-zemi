<template>
    <ion-page>
        <ion-header :translucent="true">
        <ion-toolbar>
            <ion-buttons>
                <ion-button @click="logout" expand="round" class="ion-float-left">ログアウト</ion-button>
                <ion-title>{{title}}</ion-title>
                <ion-button @click="intent" expand="round" class="ion-float-right">Todo追加</ion-button>
            </ion-buttons>
        </ion-toolbar>
        </ion-header>
    
        <ion-content :fullscreen="true">
            <!-- <ion-item>
                <ion-searchbar color="light" v-model="search"></ion-searchbar>
                <ion-button expand="round" @click="search">search</ion-button>
            </ion-item> -->
            <ion-item>
                <ion-item>
                    <ion-checkbox v-model="comp_flag" @click="!comp_flag.value"></ion-checkbox>
                    <ion-label>達成済みのみ</ion-label>
                </ion-item>
                <ion-item>
                    <ion-checkbox v-model="uncomp_flag" @click="!uncomp_flag.value"></ion-checkbox>
                    <ion-label>未達成のみ</ion-label>
                </ion-item>
                <ion-item>
                    <ion-checkbox v-model="desc"></ion-checkbox>
                    <ion-label>昇順</ion-label>
                </ion-item>
                <ion-item>
                    <ion-checkbox v-model="asc"></ion-checkbox>
                    <ion-label>降順</ion-label>
                </ion-item>
            </ion-item>
            <h1 class="ion-text-align">
            </h1>

            <ion-list v-for="(item, index) in todos" :key="item.todo_id">
                <ion-item class="ion-text-center" >
                    <ion-label v-if="item.flag">
                        <div id="comp" style="background-color:aqua">
                            <h1>{{map.get(item.flag)}}</h1>
                        </div>
                    </ion-label>
                    <ion-label v-else>
                        <div id="uncomp" style="background-color:orangered">
                            <h1>{{map.get(item.flag)}}</h1>
                        </div>
                    </ion-label>
                    <ion-label>
                        <h1 style="color: #000000;">{{item.title}}</h1>
                        <p style="color: #000000;">{{item.todo}}</p>
                    </ion-label>
                    <ion-label>
                        <ion-buttons style="color: #1e90ff;" class="ion-float-center">
                            <ion-button @click="del(item.todo_id, index)">削除</ion-button>
                            <ion-button v-if="!item.flag" @click="upd(item.todo_id, item.flag, index)">達成へ</ion-button>
                            <ion-button v-else @click="upd(item.todo_id, item.flag, index)">未達成へ</ion-button>
                        </ion-buttons>
                    </ion-label>
                </ion-item>
            </ion-list>
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
    IonList,
    IonLabel,
    // IonSearchbar,
    IonCheckbox,

} from '@ionic/vue';
import { defineComponent, ref, reactive, watch, onMounted, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import ipaddress from '@/address'
import {useCookies} from "vue3-cookies"

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
        const todo_desc = ref("desc")
        const todos = ref([
            Number,
            String,
            String,
            Boolean,
            Date
        ])

        //各sort機能のflag変数
        //>>>>
        const comp_flag = ref(false)
        const uncomp_flag = ref(false)
        const desc = ref(true)
        const asc = ref(false)
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

        //post通信を行う部分
        //その１：取得
        //>>>>
        const allfetch = () =>{
            const url = "http://"+ipaddress+"/zemi/select"
            const data = {
                user_id : auth_info.value
            };

            fetch(url, {
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            })
            .then(response => {
                return response.json()
            }).then(res =>{
                todos.value = res

            })
            .catch((error)=>{
                console.log("occurred error:" + error)
            })
        }
        //<<<<

        //その２：削除
        const del = (todo_id: number, id:number) =>{
            const addr = "http://"+ipaddress+"/zemi/delete"
            const data = {
                todo_id: todo_id
            }
            fetch(addr, {
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            })
            .then(response=>{
                return response
            }).then(res=>{
                console.log(res)
                todos.value.splice(id, 1)
                alert("削除完了しました")
            }).catch(err =>{
                console.log(err)
                alert("削除失敗しました")
            })
        }

        //その３：更新 
        const upd = (todo_id: number, flag:boolean, id:number) =>{
            const addr = "http://"+ipaddress+"/zemi/update"
            const data = {
                todo_id : todo_id,
                flag : flag
            }
            fetch(addr, {
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            })
            .then(response=>{
                return response
            }).then(res=>{
                console.log("response:"+res+" and index number:"+id)
                comp_flag.value = false
                uncomp_flag.value = false
                allfetch()
                alert("TODOの達成状況を変更しました")
            }).catch(err=>{
                console.log(err)
                alert("達成に変更できませんでした")
            })
        }

        //ここでcookieデータを削除しログアウトする
        const logout = () =>{
            cookies.remove('user_id')
            if(cookies.get('user_id') == undefined){
                alert("ログアウトしました")
                router.push('/signin')
            }else{
                alert("ログアウトできませんでした")
            }
        }

        //Todo作成後などライフサイクルに変化がないときにデータを再取得するための監視関数
        watch(route, () =>{
            allfetch()
        })
        //ライフサイクルに変化があったとき(再描画等)に呼び出される関数
        onMounted(() =>{
            allfetch()
        })

        //createTodoへの遷移用関数
        const intent = () =>{
            router.push("/createTodo")
        }

        watchEffect(() => {
            console.log(comp_flag.value)
            allfetch()
            if(comp_flag.value && uncomp_flag.value){
                allfetch()
            }else if(comp_flag.value){
                progress(1)
                console.log("fetch予定 comp")
            }else if(uncomp_flag.value){
                progress(0)
                console.log("fetch予定 uncomp")
            }
        })

        const progress = (flag : number) =>{
            const addr:string = "http://"+ipaddress+"/zemi/prog"
            const data = {
                flag : flag,
                user_id : auth_info.value
            }
            fetch(addr, {
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            })
            .then((response)=> response.json())
            .then((res)=>{
                todos.value = res
            })
            .catch((err)=>console.error(err))
        }

        return{
            title,
            map,
            todos,
            intent,
            comp_flag,
            uncomp_flag,
            desc,
            asc,
            del,
            upd,
            allfetch,
            logout,
            search,
            progress,
        }
    },
    components:{
        IonContent,
        IonHeader,
        IonPage,
        IonTitle,
        IonToolbar,
        IonList,
        IonLabel,
        IonButton,
        IonButtons,
        IonItem,
        // IonSearchbar,
        IonCheckbox,
    }
})
</script>
<style>
ion-title{
    text-align: center;
}
</style>
