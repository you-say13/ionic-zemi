<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="ion-block">
      </div>
      <div class="ion-text-center ion-padding-top">
        <ion-button expand="round" @click="inc()">+</ion-button>
        <ion-button expand="round" @click="dec()">-</ion-button>
        <ion-button expand="round" @click="setImage()">image change</ion-button>
        <p>{{count}}</p>
        <p>{{img}}</p>

        <img :src=img>
        
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/vue';
import { defineComponent, ref, } from 'vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
  },
  props:{
    counter:{
      type: Number,
      default: 0,
    },
  },
  setup(props){
    const count = ref(props.counter)
    const img = ref("images/elephant_apng_zopfli.png")

    const inc = () => count.value++;
    const dec = () => count.value--;

    const setImage = () => {
      if(count.value == 0){
        img.value == "images/elephant_apng_zopfli.png"
      }else if(count.value == 100){
        img.value == "images/ezgif-2-a6c8960bc5.gif"
      }else{
        img.value == "images/sdgs.png"
      }
    };

    return {
      count,
      img,
      inc,
      dec,
      setImage
    }
  },
});
</script>

<style scoped>
ion-content{
  --background: unset;
}

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
