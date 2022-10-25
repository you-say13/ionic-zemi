<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons>
                    <ion-back-button default-href="/Todo"></ion-back-button>
                    <ion-title>{{title}}</ion-title>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <h1>{{todos.title}}</h1>
            <p>{{todos.todo_id}}</p>
            <p>{{todos.todo}}</p>
            <p>{{todos.flag}}</p>
            <p>{{todos.date}}</p>
        </ion-content>
    </ion-page>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonContent,
    IonTitle,
} from '@ionic/vue'

export default defineComponent({
    setup(props) {
        const title = ref(props.Title)
        const todos = ref({
            todo_id: Number,
            title: String,
            todo: String,
            flag: Boolean,
            date: Date
        })

        onMounted(() =>{
            const route = useRoute()

            console.log("show useRoute:" + route.path)

            const { id } = route.query

            console.log("get routing id:"+id)

            fetch("http://192.168.11.47:3000/zemi/desc?id=" + id)
                .then(response=>{
                    return response.json()
                }).then(res =>{
                    console.log(res[0])
                    todos.value = res[0]
                }).catch((err)=>{
                    console.log(err)
                })
        })

        return {
            title,
            todos
        }
    },
    props:{
        Title:{
            type:String
        }
    },
    components:{
        IonPage,
        IonHeader,
        IonToolbar,
        IonBackButton,
        IonButtons,
        IonContent,
        IonTitle
    }
})
</script>
