<template>
    <ion-page>
        <ion-header :translucent="true">
        <ion-toolbar>
            <ion-title>{{title}}</ion-title>
        </ion-toolbar>
        </ion-header>
    
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                <ion-title size="large">{{title}}</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-list v-for="item in todos" :key="item.index">
                <ion-label>
                    <h1>{{item.title}}</h1>
                    <p>{{item.todo}}</p>
                    <h6 style="color: #777777">{{map.get(item.flag)}}</h6>
                </ion-label>
            </ion-list>
            <hr>

            <ion-button @click="intent" expand="round" class="ion-float-right">Todo作成</ion-button>

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
    IonButton, 
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
        const map = reactive(new Map([[0, "未達成"],[1, "達成済み"]]))
        const todos = ref({})
        axios.get("http://localhost:3000/zemi/select")
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
        IonButton,
        IonList,
        IonLabel
    }
})
</script>
