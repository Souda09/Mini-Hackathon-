import supabase from "./config.js";
console.log(supabase)

let userName = document.getElementById("username")
let logout = document.getElementById("logout")

async function fetchuser(){
    try{

    const {data, error} = await supabase.auth.getUser()
    if(data){
        console.log(data)
        userName.innerHTML = data.user.user_metadata.name;

    }
    }

    catch(err){
        console.log(err)
    }
}
fetchuser()


// fetech user email
// / Function to fetch logged-in user
async function fetchUserEmail() {
    try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (data.user) {
            // Show email in navbar
            userEmail.innerText = data.user.email; 
        }
    } catch(err) {
        console.log(err);
    }
}

// Call function on page load
fetchUserEmail();


window.logoutUser = async function() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        // Redirect to login page after logout
        window.location.href = "login.html";
    } catch(err) {
        console.log(err);
    }
}