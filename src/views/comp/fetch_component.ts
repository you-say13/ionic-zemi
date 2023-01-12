export const fetch_component = () =>{
    const allfetch = async (ipaddress: string, auth_info: number, desc: string) =>{
        const url = "http://"+ipaddress+"/zemi/select"
        let tododata;
        const data = {
            user_id : auth_info,
            desc : desc
        }
        await fetch(url, {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })
        .then(response => {
            return response.json()
        }).then(res =>{
            if(res.message == "error"){
                alert("アクセス回数が多すぎます。少し時間をおいて下さい")
            }else{
                tododata = res
            }
        })
        .catch((error)=>{
            console.log("occurred error:" + error)
        })
        return await tododata
    }

    //その２：削除
    const del = async (ipaddress: string, auth_info:number, todo_id: number) =>{
        const addr:string = "http://"+ipaddress+"/zemi/delete"
        const data = {
            todo_id : todo_id,
            user_id : auth_info
        }
        await fetch(addr, {
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response=>{
            return response
        })
    }

    //その３：更新 
    const upd = async (ipaddress: string, todo_id: number, flag: boolean) =>{
        const addr = "http://"+ipaddress+"/zemi/update"
        console.log(ipaddress+":"+todo_id+":"+flag)
        const data = {
            todo_id : todo_id,
            flag : flag,
        }
        await fetch(addr, {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })
        .then(response=>{
            return response
        }).then(res=>{
            console.log(res)
        }).catch(err=>{
            console.log(err)
            alert("達成に変更できませんでした")
        })
    }

    const progress = async(ipaddress: string, auth_info: number, desc: string, flag : number) =>{
        let prog_todo;
        console.log(ipaddress+":"+auth_info+":"+desc+":"+flag)
        const addr:string = "http://"+ipaddress+"/zemi/prog"
        const data = {
            flag : flag,
            userid : auth_info,
            desc : desc
        }
        await fetch(addr, {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })
        .then((response)=> {
            return response.json()
        })
        .then((res)=>{
            prog_todo = res
            console.log()
        })
        .catch((err)=>console.error(err))

        return await prog_todo
    }

    return{
        allfetch,
        del,
        upd,
        progress,
    }
}