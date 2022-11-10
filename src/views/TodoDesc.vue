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
        <ion-content class="ion-text-center">
            <h1>タイトル:{{todos.title}}</h1>
            <p>Todo番号:{{todos.todo_id}}</p>
            <p>内容:{{todos.todo}}</p>
            <p>進捗:{{todos.flag}}</p>
            <p>日付:{{todos.date}}</p>
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
import ipaddress from '@/address'

export default defineComponent({
    setup(props) {
        const title = ref(props.Title)
        const todos = ref([
            Number,
            String,
            String,
            Boolean,
            Date
        ])

        onMounted(() =>{
            const route = useRoute()

            console.log("show useRoute:" + route.path)

            const { id } = route.query

            console.log("get routing id:"+id)

            fetch("http://"+ipaddress+"/zemi/desc?id=" + id)
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
