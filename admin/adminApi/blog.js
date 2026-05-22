async function loadAdminBlogs() {
    const tbody = document.getElementById("blogTableBody");
    if (!tbody) return;
    
    try {
        const res = await fetch(`${domin}/api/blog/getall`);
        const result = await res.json();

        if (result.status && result.data && result.data.length > 0) {
            tbody.innerHTML = "";
            result.data.forEach((blog, index) => {
                // Strip HTML tags for short description if content is rich text
                let tempDiv = document.createElement("div");
                tempDiv.innerHTML = blog.content || "";
                let textContent = tempDiv.textContent || tempDiv.innerText || "";
                const shortDesc = textContent.length > 60 ? textContent.substring(0, 60) + "..." : (textContent || "No Description");
                
                const statusBadge = (blog.status === true || blog.status === "true" || blog.status === 1 || blog.status === "1")
                    ? `<span class="badge badge-success" style="background-color: #22c55e; color: white; padding: 4px 8px; border-radius: 4px;">Active</span>`
                    : `<span class="badge badge-danger" style="background-color: #ef4444; color: white; padding: 4px 8px; border-radius: 4px;">Inactive</span>`;

                const li = document.createElement("li");
                li.className = "attribute-item flex items-center justify-between gap20";

                li.innerHTML = `
                    <div class="body-text" style="flex:0 0 60px; max-width:60px;">${index + 1}</div>
                    <div class="name flex items-center gap10" style="flex: 0 0 80px;">
                        <img src="${blog.featuredImage || 'images/avatar/user-1.png'}" style="width:40px;height:40px;border-radius:6px;object-fit:cover;" alt="Blog Image">
                    </div>
                    <div class="name" style="flex: 0 0 150px;">
                        <div class="body-title-2">${blog.title}</div>
                    </div>
                    <div class="body-text" style="flex: 1;">${shortDesc}</div>
                    <div class="body-text" style="flex: 0 0 80px;">${statusBadge}</div>
                    <div class="list-icon-function" style="flex: 0 0 60px;">
                        <div class="item  text-primary" onclick="editBlog(${blog.id})" style="cursor: pointer;">
                            <i class="icon-edit-3"></i>
                        </div>
                    </div>
                    <div class="list-icon-function" style="flex: 0 0 60px;">
                        <div class="item  text-danger" onclick="deleteBlog(${blog.id})" style="cursor: pointer;">
                            <i class="icon-trash-2"></i>
                        </div>
                    </div>
                `;

                tbody.appendChild(li);
            });
        } else {
            tbody.innerHTML = `<li class="attribute-item"><div class="body-text">No blogs found.</div></li>`;
        }
    } catch (err) {
        console.error("Error loading blogs:", err);
        tbody.innerHTML = `<li class="attribute-item"><div class="body-text text-danger">Failed to load blogs.</div></li>`;
    }
}



function deleteBlog(id) {
    const token = localStorage.getItem("authToken");
    if (!token) {
        if(typeof iziToast !== 'undefined') iziToast.error({ title: 'Error', message: 'Unauthorized access', position: 'topRight' });
        return;
    }
    
    iziToast.question({
        timeout: false, close: false, overlay: true, displayMode: 'once',
        title: 'Confirm', message: 'Are you sure you want to delete this blog?', position: 'center',
        buttons: [
            ['<button><b>YES</b></button>', async function (instance, toast) {
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                try {
                    // Note: update the API route logic to match your real backend delete URL. 
                    const res = await fetch(`${domin}/api/blog/delete/${id}`, { 
                        method: "DELETE", headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        iziToast.success({ title: 'Success', message: 'Blog deleted successfully', position: "topRight" });
                        await loadAdminBlogs();
                    } else {
                        iziToast.error({ title: 'Error', message: 'Failed to delete blog', position: "topRight" });
                    }
                } catch (error) {
                    console.error(error);
                    iziToast.error({ title: 'Error', message: 'Something went wrong', position: "topRight" });
                }
            }, true],
            ['<button>NO</button>', function (instance, toast) { instance.hide({ transitionOut: 'fadeOut' }, toast, 'button'); }]
        ]
    });
}

document.addEventListener("DOMContentLoaded", loadAdminBlogs);



// Edit blog function (redirect to edit page with blog ID)
function editBlog(id) {
    window.location.href = `edit-blog.php?id=${id}`;
}



// ========================== ADD BLOG ===========================
document.addEventListener("DOMContentLoaded", () => {
    const addBlogForm = document.getElementById("addBlogForm");
    if (!addBlogForm) return; // Exit silently if we are not on the "Add Blog" page

    addBlogForm.addEventListener("submit", async function (e) {
        e.preventDefault(); // Stop standard form submission

        const token = localStorage.getItem("authToken");
        if (!token) {
            iziToast.error({ title: "Error", message: "Login required", position: "topRight" });
            return;
        }

        const title = addBlogForm.querySelector('input[name="text"]').value.trim();
        const content = addBlogForm.querySelector('textarea[name="description"]').value.trim();
        const fileInput = document.getElementById("myFile");
        const statusToggle = document.getElementById("statusToggle");
        const isActive = statusToggle ? statusToggle.checked : false;

        if (!title) {
            iziToast.error({ title: "Error", message: "Blog title is required", position: "topRight" });
            return;
        }

        if (!content) {
            iziToast.error({ title: "Error", message: "Blog description/content is required", position: "topRight" });
            return;
        }

        if (!fileInput || !fileInput.files[0]) {
            iziToast.error({ title: "Error", message: "Please upload an image", position: "topRight" });
            return;
        }

        const formData = new FormData();
        formData.append("Title", title);
        formData.append("Content", content);
        formData.append("ImageFile", fileInput.files[0]);
        formData.append("Status", isActive ? "true" : "false");

        try {
            const res = await fetch(`${domin}/api/blog/add`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const errorText = await res.text();
                console.error("Backend Error (Not JSON):", errorText);
                throw new Error("Backend did not return JSON. Check browser console.");
            }

            const data = await res.json();

            if (res.ok && data.status !== false) {
                iziToast.success({ title: "Success", message: data.message || "Blog added successfully", position: "topRight" });
                setTimeout(() => {
                    window.location.href = "blog-list.php";
                }, 1000);
            } else {
                iziToast.error({ title: "Error", message: data.message || "Failed to add blog", position: "topRight" });
            }
        } catch (err) {
            console.error("Catch Error:", err.message);
            iziToast.error({ title: "Error", message: err.message || "Server error occurred", position: "topRight" });
        }
    });
});


// ========================== EDIT BLOG ===========================
document.addEventListener("DOMContentLoaded", async () => {
    const editBlogForm = document.getElementById("editBlogForm");
    if (!editBlogForm) return; // Exit silently if we are not on the "Edit Blog" page

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    // 1️⃣ PREFILL DATA ON LOAD
    try {
        const res = await fetch(`${domin}/api/blog/getblogbyid/${id}`);
        const result = await res.json();
        
        if (result.status && result.data) {
            const blog = result.data;
            
            // Fill input fields
            document.querySelector('input[name="text"]').value = blog.title || "";
            document.querySelector('textarea[name="description"]').value = blog.content || "";
            
            const statusToggle = document.getElementById("statusToggle");
            if (statusToggle) {
                statusToggle.checked = (blog.status === true || blog.status === "true" || blog.status === 1 || blog.status === "1" || blog.isActive === true);
            }

            // Show existing image preview
            if (blog.featuredImage) {
                const preview = document.getElementById("imagePreview");
                const icon = document.getElementById("uploadIcon");
                const text = document.getElementById("uploadText");
                
                preview.src = blog.featuredImage;
                preview.style.display = "block";
                icon.style.display = "none";
                text.style.display = "none";
            }
        }
    } catch (err) {
        console.error("Load blog error:", err);
    }

    // 2️⃣ HANDLE FORM SUBMIT FOR UPDATE
    editBlogForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const token = localStorage.getItem("authToken");
        if (!token) {
            iziToast.error({ title: "Error", message: "Login required", position: "topRight" });
            return;
        }

        const title = editBlogForm.querySelector('input[name="text"]').value.trim();
        const content = editBlogForm.querySelector('textarea[name="description"]').value.trim();
        const fileInput = document.getElementById("myFile");
        const statusToggle = document.getElementById("statusToggle");
        const isActive = statusToggle ? statusToggle.checked : false;

        const formData = new FormData();
        formData.append("Title", title);
        formData.append("Content", content);
        formData.append("Status", isActive ? "true" : "false");

        if (fileInput && fileInput.files[0]) {
            formData.append("ImageFile", fileInput.files[0]);
        } else {
            formData.append("ImageFile", ""); // Send empty string if no new image is selected
        }

        try {
            const res = await fetch(`${domin}/api/blog/edit/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();

            if (res.ok && data.status !== false) {
                iziToast.success({ title: "Success", message: data.message || "Blog updated successfully", position: "topRight" });
                setTimeout(() => window.location.href = "blog-list.php", 800);
            } else {
                iziToast.error({ title: "Error", message: data.message || "Failed to update blog", position: "topRight" });
            }
        } catch (err) {
            console.error("Catch Error:", err.message);
            iziToast.error({ title: "Error", message: err.message || "Server error occurred", position: "topRight" });
        }
    });
});
