<template>
    <div class="img_view">
        <img :src="image" key=index>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    props:{
        img:String
    },
    setup(props) {
        const image = ref(props.img)
        return{
            image
        }
    },
})
</script>
