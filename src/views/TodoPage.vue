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
            <ion-list v-for="(item, index) in todos" :key="item.todo_id">
                <ion-item class="ion-text-center ion-padding-horizontal" >
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
                            <ion-button @click="desc(item.todo_id)">詳細</ion-button>
                        </ion-buttons>
                    </ion-label>
                </ion-item>
            </ion-list>
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
    IonList,
    IonLabel,
    IonCheckbox,

} from '@ionic/vue';
import { defineComponent, ref, reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import ipaddress from '@/address'
import {useCookies} from "vue3-cookies"

export default defineComponent({
    props:{
        Title:{
            type:String
        }
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
        const comp_flag = ref(Boolean)
        const uncomp_flag = ref(Boolean)

        const router = useRouter()
        const route = useRoute()


        const { cookies } = useCookies();

        console.log(cookies.get('user_id'))

        if(cookies.get("user_id") == undefined){
            router.push("/signin")
        }else{
            console.log("ok cookie is "+ cookies.get('user_id'))
        }


        console.log(ipaddress)

        onMounted(()=>{
            allfetch()
        })

        const allfetch = () =>{
            fetch("http://"+ ipaddress +"/zemi/select")
            .then(response => {
                return response.json()
            }).then(res =>{
                console.log(res)
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

        // watch(route, () =>{
        //     console.log("ルートが変わりました")
        //     allfetch()
        // })
        
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
            fetch("http://" + ipaddress + "/zemi/delete?id="+todo_id)
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
            fetch("http://" + ipaddress + "/zemi/update?id=" + todo_id)
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
    }
})
</script>
<style>
ion-title{
    text-align: center;
}
</style>
