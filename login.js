import supabase from "./config.js";
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.5/+esm';
console.log(supabase)

let logform = document.getElementById("logform")
let lemail = document.getElementById("lemail")
let lpassword = document.getElementById("lpassword")


async function Login(e){
    e.preventDefault()

    try{
        if(! lemail.value){
            alert("Please enter  email")
            return
        }
        else if(! lpassword.value){
            alert("Please enter password")
            return
        }

const { data, error } = await supabase.auth.signInWithPassword({
  email: lemail.value.trim(),
  password: lpassword.value.trim(),
})

if(error){
   alert(error.message)
    console.log(error)
}
else{
    console.log(data)
    Swal.fire({
                    title: 'Login Successfully!',
                    icon: 'success',
                }).then(() => {
                    window.location.href = "home.html"; 
                });
            }
}
    catch(err){
        console.log(err)
    }
}
console.log("Login JS loaded successfully")

logform && logform.addEventListener('submit', Login)