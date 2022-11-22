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

            <ion-item>
                <ion-checkbox v-model="comp_flag.value" @change="complete_only()"></ion-checkbox>
                <ion-label>達成済みのみ</ion-label>
                <ion-checkbox v-model="uncomp_flag.value" @change="uncomplete_only()"></ion-checkbox>
                <ion-label>未達成のみ</ion-label>
            </ion-item>
            <h1 class="ion-text-align">
            </h1>

            <ion-list v-for="(item, index) in todos" :key="item.todo_id">
                <ion-item class="ion-text-center" >
                    <ion-label v-if="item.flag">
                        <div style="background-color:aqua">
                            <h1>{{map.get(item.flag)}}</h1>
                        </div>
                    </ion-label>
                    <ion-label v-else>
                        <div style="background-color:orangered">
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
                            <ion-button @click="upd(item.todo_id, index)">達成</ion-button>
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
    IonCheckbox,

} from '@ionic/vue';
import { defineComponent, ref, reactive, watchEffect, watch, onMounted } from 'vue'
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
        const todos = ref([
            Number,
            String,
            String,
            Boolean,
            Date
        ])
        const flag = ref(props.flag)
        const comp_flag = ref(Boolean)
        const uncomp_flag = ref(Boolean)

        const auth_info = ref()

        const router = useRouter()
        const route = useRoute()

        const { cookies } = useCookies();

        if(cookies.get("user_id") == undefined){
            router.push("/signin")
        }else{
            auth_info.value = atob(cookies.get('user_id'))
        }

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

        const logout = () =>{
            cookies.remove('user_id')
            if(cookies.get('user_id') == undefined){
                alert("ログアウトしました")
                router.push('/signin')
            }else{
                alert("ログアウトできませんでした")
            }
        }

        watch(route, () =>{
            allfetch()
        })

        onMounted(() =>{
            allfetch()
        })
        
        const intent = () =>{
            router.push("/createTodo")
        }

        const complete_only = ()=>{
            console.log("complete_only:" + comp_flag.value)
        }

        const uncomplete_only = () =>{
            console.log("uncomplete_only" + uncomp_flag.value)
        }

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

        const upd = (todo_id: number, id:number) =>{
            const addr = "http://"+ipaddress+"/zemi/update"
            const data = {
                todo_id : todo_id
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
                allfetch()
                alert("TODOを達成しました")
            }).catch(err=>{
                console.log(err)
                alert("達成に変更できませんでした")
            })
        }

        const desc = (todo_id: number) =>{
            console.log(todo_id)
            router.push({
                name:'desc',
                query:{id : todo_id},
            })
        }

        return{
            title,
            map,
            todos,
            intent,
            complete_only,
            uncomplete_only,
            comp_flag,
            uncomp_flag,
            desc,
            del,
            upd,
            allfetch,
            logout
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
        IonCheckbox,
        IonButton,
        IonButtons,
        IonItem,
    }
})
</script>
<style>
ion-title{
    text-align: center;
}
</style>
