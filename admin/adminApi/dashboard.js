document.addEventListener("DOMContentLoaded", async () => {
    const reportContainer = document.getElementById("dashboardReportContainer");
    
    // Only run if we are on the dashboard page
    if (!reportContainer) return;

    // Determine the base URL, assuming `domin` is globally available from domin.js
    const apiBase = typeof domin !== 'undefined' ? domin : 'https://microsite-backend.workarya.com';
    const token = localStorage.getItem("authToken");

    // Mapping for the API response keys to UI presentation
    const reportCards = [
        { key: "totalUsers", title: "Total Users", icon: "icon-users", color: "#2377FC" },
        { key: "totalProducts", title: "Total Products", icon: "icon-shopping-bag", color: "#22C55E" },
        { key: "totalVariants", title: "Total Variants", icon: "icon-layers", color: "#FF5200" },
        { key: "totalCategories", title: "Total Categories", icon: "icon-grid", color: "#EC4899" },
        { key: "totalSubCategories", title: "Total Sub Categories", icon: "icon-list", color: "#14B8A6" },
        { key: "totalChildCategories", title: "Child Categories", icon: "icon-menu", color: "#F97316" },
        { key: "totalBrands", title: "Total Brands", icon: "icon-star", color: "#EAB308" },
        { key: "totalBlogs", title: "Total Blogs", icon: "icon-file-text", color: "#8B5CF6" },
        { key: "totalColors", title: "Total Colors", icon: "icon-aperture", color: "#EF4444" },
        { key: "totalSizes", title: "Total Sizes", icon: "icon-maximize", color: "#3B82F6" },
        { key: "totalCustomerLogos", title: "Customer Logos", icon: "icon-image", color: "#06B6D4" }
    ];

    try {
        const response = await fetch(`${apiBase}/api/dashboard/getreport`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (response.ok && result.status) {
            const data = result.data;
            reportContainer.innerHTML = ""; // Clear existing loading state/content

            reportCards.forEach(card => {
                const count = data[card.key] || 0;
                
                const cardHTML = `
                <div class="wg-chart-default">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap14">
                            <div class="image type-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="52" viewBox="0 0 48 52" fill="none">
                                    <path d="M19.1094 2.12943C22.2034 0.343099 26.0154 0.343099 29.1094 2.12943L42.4921 9.85592C45.5861 11.6423 47.4921 14.9435 47.4921 18.5162V33.9692C47.4921 37.5418 45.5861 40.8431 42.4921 42.6294L29.1094 50.3559C26.0154 52.1423 22.2034 52.1423 19.1094 50.3559L5.72669 42.6294C2.63268 40.8431 0.726688 37.5418 0.726688 33.9692V18.5162C0.726688 14.9435 2.63268 11.6423 5.72669 9.85592L19.1094 2.12943Z" fill="${card.color}" />
                                </svg>
                                <i class="${card.icon}"></i>
                            </div>
                            <div>
                                <div class="body-text mb-2">${card.title}</div>
                                <h4>${count}</h4>
                            </div>
                        </div>
                    </div>
                </div>`;
                
                reportContainer.insertAdjacentHTML('beforeend', cardHTML);
            });
        } else {
            console.error("Failed to load dashboard report", result);
        }
    } catch (error) {
        console.error("Dashboard API Error:", error);
    }
});