import supabase from "./config.js";

async function getPostDetails() {
    // 1. URL se Post ID nikalna (?id=...)
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");

    if (!postId) {
        window.location.href = "index.html";
        return;
    }

    // 2. Database se post fetch karna
    const { data: post, error } = await supabase
        .from("PostApp")
        .select("*")
        .eq("id", postId)
        .single();

    const container = document.getElementById("detailsCard");

    if (error || !post) {
        container.innerHTML = `<div class="alert alert-danger m-3">Post not found or deleted.</div>`;
        return;
    }

    // 3. HTML render karna
    container.innerHTML = `
        ${post.imageUrl ? `<img src="${post.imageUrl}" class="card-img-top" alt="post image" style="max-height: 500px; object-fit: contain; background: #f8f9fa;">` : ""}
        <div class="card-body p-4">
            <h1 class="display-6 fw-bold">${post.title}</h1>
            <div class="d-flex align-items-center mb-4 text-muted">
                <span class="me-3"><strong>Posted by:</strong> ${post.name}</span>
                <span><strong>Email:</strong> ${post.email}</span>
            </div>
            <hr>
            <p class="fs-5" style="white-space: pre-wrap; line-height: 1.6;">${post.content}</p>
            <hr>
            <p class="text-muted small">Post ID: ${post.id} | Created: ${new Date(post.created_at).toLocaleString()}</p>
        </div>
    `;
}

getPostDetails();