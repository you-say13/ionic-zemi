<script lang="ts">
import { defineComponent } from 'vue'
import {
    alertController
} from '@ionic/vue'

export default defineComponent({
    setup() {
        const conf_alert = async (head:string, shead:string, ms:string, b_yes:string, b_no:string) =>{
            const alert = await alertController.create({
                header: head,
                subHeader: shead,
                message: ms,
                buttons: [
                    {
                        text: b_yes,
                        role:"confirm",
                        handler: () =>{
                            alertflag.value = true
                        }
                    },
                    {
                        text: b_no,
                        role:"cancel",
                        handler: ()=>{
                            alertflag.value = false
                        }
                    }
                    
                ]
            })
            
            await alert.present();
        }

        return { conf_alert };
    },
    components:{
        alertController
    }
})
</script>
