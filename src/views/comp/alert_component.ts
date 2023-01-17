import {alertController} from '@ionic/vue'

export const ionic_alert = async (option:{
    message : string,
    header : string,
    conf_text? : string,
    dis_text? : string
}) =>{
    let f;
    const all_alert = await alertController.create({
        header: option.header,
        message: option.message,
        buttons: [{
            text: option.conf_text || "はい",
            role: "confirm",
            handler: () =>{
                f = true
            }
        },
        {
            text: option.dis_text || "いいえ",
            role: "cancel",
            handler: () =>{
                f = false
            }
        }],
    })

    await all_alert.present();
    await all_alert.onWillDismiss();
    return await f;
}

