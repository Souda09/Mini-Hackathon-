import supabase from "./config.js";
console.log(supabase)

let userName = document.getElementById("username")
let logout = document.getElementById("logout")

async function fetchuser(){
    try{

    const {data, error} = await supabase.auth.getUser()
    if(data){
        console.log(data)
        // userName.innerHTML = data.user.user_metadata.name;

    }
    }

    catch(err){
        console.log(err)
    }
}
fetchuser()