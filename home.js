// // import supabase from "./config.js";
// // console.log(supabase)

// // let userName = document.getElementById("username")
// // let logout = document.getElementById("logout")

// // async function fetchuser(){
// //     try{

// //     const {data, error} = await supabase.auth.getUser()
// //     if(data){
// //         console.log(data)
// //         userName.innerHTML = data.user.user_metadata.name;

// //     }
// //     }

// //     catch(err){
// //         console.log(err)
// //     }
// // }
// // fetchuser()


// // // fetech user email
// // // / Function to fetch logged-in user
// // async function fetchUserEmail() {
// //     try {
// //         const { data, error } = await supabase.auth.getUser();
// //         if (error) throw error;

// //         if (data.user) {
// //             // Show email in navbar
// //             userEmail.innerText = data.user.email; 
// //         }
// //     } catch(err) {
// //         console.log(err);
// //     }
// // }

// // // Call function on page load
// // fetchUserEmail();


// // window.logoutUser = async function() {
// //     try {
// //         const { error } = await supabase.auth.signOut();
// //         if (error) throw error;

// //         // Redirect to login page after logout
// //         window.location.href = "login.html";
// //     } catch(err) {
// //         console.log(err);
// //     }
// // }

//     import supabase from "./config.js";

// const allPostsContainer = document.getElementById("myPosts"); // Ensure HTML has id="myPosts" inside a div with class="row"
// const userEmailText = document.getElementById("userEmail");

// async function init() {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (user && userEmailText) userEmailText.innerText = user.email;
    
//     loadAllPosts();
// }

// // 1. Load ALL posts from everyone
// async function loadAllPosts() {
//     const { data, error } = await supabase
//         .from("PostApp")
//         .select("*")
//         .order("created_at", { ascending: false });

//     if (error) return console.error("Error:", error.message);

//     allPostsContainer.innerHTML = ""; 

//     data.forEach(post => {
//         // Bootstrap 'row' ke andar 'col' hona zaroori hai row mein dikhane ke liye
//         allPostsContainer.innerHTML += `
//             <div class="col-lg-4 col-md-6 mb-4">
//                 <div class="card h-100 shadow-sm border-0">
//                     ${post.imageUrl ? `<img src="${post.imageUrl}" class="card-img-top" style="height:200px; object-fit:cover;">` : ""}
//                     <div class="card-body d-flex flex-column">
//                         <h5 class="fw-bold">${post.title}</h5>
//                         <p class="text-muted small flex-grow-1">${post.content.substring(0, 100)}...</p>
//                         <a href="post-details.html?id=${post.id}" class="btn btn-primary w-100 mt-2">View Details</a>
//                     </div>
//                     <div class="card-footer bg-white border-0 text-muted small">
//                         By: ${post.name || 'User'}
//                     </div>
//                 </div>
//             </div>
//         `;
//     });
// }

// window.logoutUser = async () => {
//     await supabase.auth.signOut();
//     window.location.href = "login.html";
// };

// init();



import supabase from "./config.js";

const allPostsContainer = document.getElementById("myPosts");
const userEmailText = document.getElementById("userEmail");
const postForm = document.getElementById("postForm"); // Ensure form ID is correct

async function init() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        window.location.href = "login.html"; // Agar login nahi hai toh bhej do
        return;
    }

    if (userEmailText) userEmailText.innerText = user.email;
    
    loadAllPosts(); // Sabki posts dikhayega
}

// --- 1. Load ALL posts from everyone ---
async function loadAllPosts() {
    const { data, error } = await supabase
        .from("PostApp")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error loading posts:", error.message);
        return;
    }

    allPostsContainer.innerHTML = ""; 

    data.forEach(post => {
        allPostsContainer.innerHTML += `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    ${post.imageUrl ? `<img src="${post.imageUrl}" class="card-img-top" style="height:200px; object-fit:cover;">` : ""}
                    <div class="card-body d-flex flex-column">
                        <h5 class="fw-bold">${post.title}</h5>
                        <p class="text-muted small flex-grow-1">${post.content.substring(0, 100)}...</p>
                        <a href="post-details.html?id=${post.id}" class="btn btn-outline-primary w-100 mt-2 rounded-pill">View Details</a>
                    </div>
                    <div class="card-footer bg-white border-0 text-muted small d-flex justify-content-between">
                        <span>By: ${post.name || 'User'}</span>
                        <span>${new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `;
    });
}

// --- 2. Create Post Logic ---
if (postForm) {
    postForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const { data: { user } } = await supabase.auth.getUser();
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;
        const imageFile = document.getElementById("image").files[0];

        let finalImageUrl = "";

        // Image upload (optional)
        if (imageFile) {
            const fileName = `${Date.now()}-${imageFile.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("UersPost")
                .upload(fileName, imageFile);

            if (!uploadError) {
                finalImageUrl = supabase.storage.from("UersPost").getPublicUrl(fileName).data.publicUrl;
            }
        }

        const { error } = await supabase.from("PostApp").insert({
            title,
            content,
            user_id: user.id,
            email: user.email,
            name: user.email.split('@')[0],
            imageUrl: finalImageUrl
        });

        if (!error) {
            Swal.fire('Success', 'Post created successfully!', 'success');
            postForm.reset();
            loadAllPosts(); // Display refresh karein
        } else {
            Swal.fire('Error', error.message, 'error');
        }
    });
}

window.logoutUser = async () => {
    await supabase.auth.signOut();
    window.location.href = "login.html";
};

init();