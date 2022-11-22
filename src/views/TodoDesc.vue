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
import { useRoute, useRouter } from 'vue-router'
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
import { useCookies } from 'vue3-cookies'

export default defineComponent({
    setup(props) {

        const route = useRoute()
        const router = useRouter()
        const {cookies} = useCookies()

        if(cookies.get("user_id") == undefined){
            router.push("/signin")
        }else{
            return
        }


        const title = ref(props.Title)
        const todos = ref([
            Number,
            String,
            String,
            Boolean,
            Date
        ])

        onMounted(() =>{
            const { id } = route.query
            const addr = "http://"+ipaddress+"/zemi/desc"
            const data = {
                id:id
            }
            fetch(addr, {
                method:"POST",
                body: JSON.stringify(data)
            })
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
