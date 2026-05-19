
async function loadBlogs() {
    const container = document.getElementById("blogContainer");
    if (!container) return;

    try {
        const res = await fetch("http://microsite_backend.workarya.com/api/blog/getall");
        const result = await res.json();

        if (!result.status) return;

        const blogs = result.data;
        container.innerHTML = "";

        blogs.forEach(blog => {
            const shortText = blog.content.length > 100 
                ? blog.content.substring(0, 100) + "..." 
                : blog.content;

            container.innerHTML += `
            <div class="entry-item col-sm-6 col-md-4 col-lg-3">
                <article class="entry entry-grid text-center">
                    <figure class="entry-media">
                        <a href="blog-detail.php?slug=${blog.slug}">
                            <img src="${blog.featuredImage}" alt="${blog.title}">
                        </a>
                    </figure>

                    <div class="entry-body">
                        <div class="entry-meta">
                            <a href="#">${new Date(blog.createdAt).toDateString()}</a>
                        </div>

                        <h2 class="entry-title">
                            <a href="blog-detail.php?slug=${blog.slug}">
                                ${blog.title}
                            </a>
                        </h2>

                        <div class="entry-cats">
                            in <a href="#">Blog</a>
                        </div>

                        <div class="entry-content">
                            <p>${shortText}</p>
                            <a href="blog-detail.php?slug=${blog.slug}" class="read-more">
                                 Read More
                            </a>
                        </div>
                    </div>
                </article>
            </div>`;
        });

    } catch (err) {
        console.error("Blog API error:", err);
    }
}

document.addEventListener("DOMContentLoaded", loadBlogs);


//  get by id blog


function getSlugFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("slug");
}


async function loadBlogBySlug() {
    const slug = getSlugFromURL();
    if (!slug) return;

    try {
        // 1️⃣ Get all blogs
        const res = await fetch("http://microsite_backend.workarya.com/api/blog/getall");
        const result = await res.json();

        if (!result.status) return;

        // 2️⃣ Find blog by slug
        const blog = result.data.find(b => b.slug === slug);
        if (!blog) return;

        // 3️⃣ Now call detail API by ID
        const detailRes = await fetch(`http://microsite_backend.workarya.com/api/blog/getblogbyid/${blog.id}`);
        const detailResult = await detailRes.json();

        const blogData = detailResult.data;

        // 4️⃣ Bind data to HTML
        document.getElementById("blogImage").src = blogData.featuredImage;
        document.getElementById("blogTitle").innerText = blogData.title;
        document.getElementById("blogContent").innerText = blogData.content;
        document.getElementById("blogDate").innerText =
            new Date(blogData.createdAt).toDateString();

        const relatedBlogs = result.data.filter(b => b.id !== blog.id);

        // 5️⃣ Populate Related Blogs (Exclude the current blog)
        const relatedContainer = document.getElementById("relatedBlogsContainer");
        if (relatedContainer) {
            
            // If Owl Carousel is already initialized, destroy it first to update DOM cleanly
            if (window.jQuery && $(relatedContainer).hasClass("owl-loaded")) {
                $(relatedContainer).trigger("destroy.owl.carousel").removeClass("owl-loaded owl-hidden");
                $(relatedContainer).find(".owl-stage-outer").children().unwrap();
            }

            relatedContainer.innerHTML = "";

            relatedBlogs.forEach(rb => {
                relatedContainer.innerHTML += `
                    <article class="entry entry-grid">
                        <figure class="entry-media">
                            <a href="blog-detail.php?slug=${rb.slug}">
                                <img src="${rb.featuredImage}" alt="${rb.title}" style="height: 250px; object-fit: cover; width: 100%;">
                            </a>
                        </figure>
                        <div class="entry-body">
                            <div class="entry-meta">
                                <a href="#">${new Date(rb.createdAt).toDateString()}</a>
                            </div>
                            <h2 class="entry-title">
                                <a href="blog-detail.php?slug=${rb.slug}">${rb.title}</a>
                            </h2>
                          
                        </div>
                    </article>`;
            });

            // Re-initialize Owl Carousel with the new items
            setTimeout(() => {
                if (window.jQuery && $.fn.owlCarousel) {
                    let options = $(relatedContainer).data("owl-options");
                    $(relatedContainer).owlCarousel(options);
                }
            }, 100);
        }

        // 6️⃣ Populate Popular Posts in Sidebar (Exclude the current blog)
        const popularContainer = document.getElementById("popularPostsContainer");
        if (popularContainer) {
            popularContainer.innerHTML = "";
            const popularBlogs = relatedBlogs.slice(0, 4); // Limit to 4 posts

            popularBlogs.forEach(pb => {
                popularContainer.innerHTML += `
                    <li>
                        <figure>
                            <a href="blog-detail.php?slug=${pb.slug}">
                                <img src="${pb.featuredImage}" alt="${pb.title}" style="width: 80px; height: 80px; object-fit: cover;">
                            </a>
                        </figure>
                        <div>
                            <span>${new Date(pb.createdAt).toDateString()}</span>
                            <h4><a href="blog-detail.php?slug=${pb.slug}">${pb.title}</a></h4>
                        </div>
                    </li>`;
            });
        }

    } catch (err) {
        console.error("Error:", err);
    }
}

document.addEventListener("DOMContentLoaded", loadBlogBySlug);
