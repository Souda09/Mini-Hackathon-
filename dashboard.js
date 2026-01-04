import supabase from "../config.js";
console.log(supabase);


async function checkRole(){
    const { data: { user } } = await supabase.auth.getUser();
    if(!user){
        window.location.herf = "./login.html";
        return
    }

    const { data, error } = await supabase
    .from('MyUsers')
    .select('role')
    .eq("uid", user.id)
    .single();

 if (error || data.role !== "admin"){
    Swal.fire({ icon: 'error', title: 'Access Denied!' })
 .then(() => window.location.href = "./index.html");
}
}
checkRole();
