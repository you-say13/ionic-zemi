import {alertController} from '@ionic/vue'

export const ionic_alert = async (ms: string, header: string) =>{
    let f;
    const all_alert = await alertController.create({
        header: header,
        message: ms,
        buttons: [{
            text: "はい",
            role: "confirm",
            handler: () =>{
                f = true
            }
        },
        {
            text: "いいえ",
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

