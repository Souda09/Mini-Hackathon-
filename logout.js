import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.5/+esm';
import supabase from "./config.js";

console.log(supabase);

let logoutbtn = document.getElementById("logout");

async function  logout(e) {
   e.preventDefault()
try{
     const { error } = await supabase.auth.signOut()
     if(error){
        console.log(error)
     }
     else{
        Swal.fire({
                title: 'Logged Out!',
                icon: 'success',
            }).then(() => {
                window.location.href = "index.html"; // Login page par bhejne ke liye
            });
        }
     }

catch(err){
    console.log(err)
}
    
}
logoutbtn && logoutbtn.addEventListener('click',logout)