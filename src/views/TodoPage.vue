<template>
    <ion-page>
        <ion-header :translucent="true">
        <ion-toolbar>
            <ion-buttons>
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
            <ion-list v-for="item in todos" :key="item.todo_id">
                <ion-label>
                    <ion-item button @click="desc(item.todo_id)">
                        <h1>{{item.title}}</h1>
                        <p style="color: #000000;">{{item.todo}}</p>
                        <ion-buttons style="color: #1e90ff;">
                            <ion-button>削除</ion-button>
                            <ion-button>達成</ion-button>
                        </ion-buttons>
                        <p style="color: #777777" class="ion-float-right">{{map.get(item.flag)}}</p>
                    </ion-item>
                </ion-label>
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
import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import ipaddress from '@/address'

export default defineComponent({
    props:{
        Title:{
            type:String
        }
    },
    setup(props) {
        const title = ref(props.Title)
        const map = reactive(new Map([[0, "未達"],[1, "達成"]]))
        const todos = ref({})
        const comp_flag = ref(Boolean)
        const uncomp_flag = ref(Boolean)

        const rout = useRouter()

        console.log(ipaddress)

        fetch("http://"+ ipaddress +":3000/zemi/select")
            .then(response => {
                return response.json()
            }).then(res =>{
                console.log(res)
                todos.value = res
            })
            .catch((error)=>{
                console.log("occurred error:" + error)
            })
        
        const intent = () =>{
            rout.push("/createTodo")
        }

        const complete_only = ()=>{
            console.log("complete_only:" + comp_flag.value)
        }

        const uncomplete_only = () =>{
            console.log("uncomplete_only" + uncomp_flag.value)
        }

        const desc = (todo_id: number) =>{
            console.log(todo_id)
            rout.push({
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
            desc
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
