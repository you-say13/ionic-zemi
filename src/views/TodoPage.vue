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
            
            <ion-list v-for="item in todos" :key="item.todo_id">
                <ion-label>
                    <ion-item>
                        <h1>{{item.title}}</h1>
                        <!-- <p style="color: #000000">{{item.todo}}</p> -->
                        <ion-buttons style="color: #1e90ff;">
                            <ion-button>削除</ion-button>
                            <ion-button>達成</ion-button>
                        </ion-buttons>
                        <p style="color: #777777" class="ion-float-right">{{map.get(item.flag)}}</p>
                    </ion-item>
                </ion-label>
                <hr>
            </ion-list>

            

        </ion-content>
    </ion-page>
</template>
<script lang="ts">
import router from '@/router';
import { 
    IonContent, 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar, 
    IonList,
    IonLabel,
} from '@ionic/vue';
import axios from 'axios';
import { defineComponent, ref, reactive } from 'vue'

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
        axios.get("http://10.16.10.61:3000/zemi/select")
        .then((response) => {
            console.log(response.data)
            todos.value = response.data
            console.log(todos)
        })
        .catch((error)=>{
            console.log("occurred error:" + error)
        })
        
        const intent = () =>{
            router.push("/createTodo")
        }

        return{
            title,
            map,
            todos,
            intent
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
    }
})
</script>
<style>
ion-title{
    text-align: center;
}
</style>
