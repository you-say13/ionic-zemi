<template>
<ion-page>
    <ion-content class="ion-text-center ion-padding-top" @click="mv()">
        <div>
            <h1>Title</h1>
            <small class="animation-text">tap to panel...</small>
        </div>
    </ion-content>
</ion-page>
</template>
<script lang="ts">
import {
    IonPage,
    IonContent,
} from "@ionic/vue"
import { defineComponent } from "@vue/runtime-core"
import { useRouter} from 'vue-router'

export default defineComponent({
    name:'TitlePage',
    components: {
        IonPage,
        IonContent
    },
    setup(){
        const router = useRouter()
        const mv = () =>{
            router.push('/signin')
        }

        return{
            mv
        }
    },
})
</script>
<style>

#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
