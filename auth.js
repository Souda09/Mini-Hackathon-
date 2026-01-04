import supabase from "./config.js";
console.log(supabase)

let  reg = document.getElementById("regform")
let sname = document.getElementById("sname");
let scontact = document.getElementById("scontact")
let semail = document.getElementById("semail")
let spassword = document.getElementById("spassword")
let log = document.getElementById("login")

async function Signup(e){
   e.preventDefault()

        try{
            if(! sname.value){
                alert("Please Enter a name")
                return
            }
            else if(!scontact.value){
                alert("Please Enter a  contact number")
                return
            }
            else if (!semail.value){
                alert("Please Enter a email")
                return
            }
            else if(! spassword.value){
                alert("Please Enter a password")
                return
            }
const { data, error } = await supabase.auth.signUp({
  email: semail.value,
  password: spassword.value,
  
  options: {
      data: {
        name: sname.value,
        contact: scontact.value,
        role: 'user'
       
      }
    }
});
if(data){
    console.log(data)
const{id,user_metadata} = data.user
console.log(data)

// table wala kam data go to table
const { error:dberr } = await supabase
  .from('MyUsers')
  .insert({ 
    uid: id ,
     name: user_metadata.name,
     email : user_metadata.email,
     role :user_metadata.role
})

if(dberr){
    console.log(dberr);
}



if(error){
    alert(error.message)
    console.log(error)
}

else{
    Swal.fire({
        icon: 'success',
        title: 'Signup Successful!',
        text: 'Welcome',
      }).then(() => {
        window.location.href = "./login.html"; // redirect after popup
      });
      
      }
      }

      else{
        console.log(error)
      }
}

        catch(err){
            console.log(err)
        }


    }

  reg && reg.addEventListener('submit', Signup)  
