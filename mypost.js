import supabase from "./config.js";

const tableBody = document.getElementById("myOwnPostsTable");
const editForm = document.getElementById("editForm");
// Bootstrap Modal instance initialize karna
let bootstrapModal;

async function init() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    
    // User email set karna
    const emailElem = document.getElementById("userEmail");
    if (emailElem) emailElem.innerText = user.email;

    // Modal ko variable mein store karna taaki hide/show ho sake
    const modalElem = document.getElementById('editModal');
    if (modalElem) {
        bootstrapModal = new bootstrap.Modal(modalElem);
    }

    loadMyPosts(user.id);
}

// 1. Load user posts into Table
async function loadMyPosts(userId) {
    const { data: posts, error } = await supabase
        .from("PostApp")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Fetch error:", error.message);
        return;
    }

    if (posts.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-muted">You haven’t created any posts yet.</td></tr>`;
        return;
    }

    tableBody.innerHTML = posts.map(post => `
        <tr>
            <td class="ps-4">
                <img src="${post.imageUrl || 'https://via.placeholder.com/60'}" class="post-img-preview border shadow-sm" style="width:50px; height:50px; object-fit:cover; border-radius:8px;">
            </td>
            <td><strong class="text-dark">${post.title}</strong></td>
            <td><span class="text-muted small">${post.content.substring(0, 40)}...</span></td>
            <td><span class="badge bg-light text-dark border">${new Date(post.created_at).toLocaleDateString()}</span></td>
            <td class="text-center">
                <div class="btn-group">
                    <button class="btn btn-outline-warning btn-sm mx-1 rounded" onclick="editPost('${post.id}')">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm mx-1 rounded" onclick="deletePost('${post.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 2. Delete Post Function
window.deletePost = async (id) => {
    const result = await Swal.fire({
        title: 'Sure?',
        text: "Deleted posts cannot be retrieved!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'yes, delete it!'
    });

    if (result.isConfirmed) {
        const { error } = await supabase.from("PostApp").delete().eq("id", id);
        if (!error) {
            Swal.fire('Deleted!', 'Post delete .', 'success');
            const { data: { user } } = await supabase.auth.getUser();
            loadMyPosts(user.id); // Refresh table
        }
    }
};

// 3. Edit Post - Modal Mein Data Bharna
window.editPost = async (id) => {
    const { data: post, error } = await supabase
        .from("PostApp")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching post:", error.message);
        return;
    }

    // Modal ke fields mein data dalna
    document.getElementById("editPostId").value = post.id;
    document.getElementById("editTitle").value = post.title;
    document.getElementById("editContent").value = post.content;

    // Modal dikhana
    bootstrapModal.show();
};

// 4. Update Post Submit Handler
if (editForm) {
    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("editPostId").value;
        const updatedTitle = document.getElementById("editTitle").value;
        const updatedContent = document.getElementById("editContent").value;

        const { error } = await supabase
            .from("PostApp")
            .update({ 
                title: updatedTitle, 
                content: updatedContent 
            })
            .eq("id", id);

        if (!error) {
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Post Updated Successfully.',
                timer: 1500,
                showConfirmButton: false
            });

            bootstrapModal.hide(); // Modal band karna
            const { data: { user } } = await supabase.auth.getUser();
            loadMyPosts(user.id); // Table refresh karna
        } else {
            Swal.fire('Error', error.message, 'error');
        }
    });
}

window.logoutUser = async () => {
    await supabase.auth.signOut();
    window.location.href = "login.html";
};

// Start initialization
init();