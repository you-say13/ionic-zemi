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
    </ion-page>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
    setup(props) {
        const title = ref(props.Title)
        const todos = ref({})

        onMounted(() =>{
            const route = useRoute()

            console.log("show useRoute:" + route.path)

            const { id } = route.query

            console.log("get routing id:"+id)

            fetch("http://10.16.10.76:3000/zemi/desc?id=" + id)
                .then(response=>{
                    return response.json()
                }).then(res =>{
                    console.log(res)
                    todos.value = res
                }).catch((err)=>{
                    console.log(err)
                })
        })

        return {
            title
        }
    },
    props:{
        Title:{
            type:String
        }
    }
})
</script>
