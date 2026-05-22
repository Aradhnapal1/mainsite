(function () {
    const isLoggedIn = localStorage.getItem("authToken");

    const currentPage = window.location.pathname.split("/").pop();

    // login page par ho to check na karo
    if (currentPage === "login.php") return;

    if (!isLoggedIn) {
        window.location.href = "login.php";
    }

    // ✅ Update Admin Header Name & Initials Avatar
    document.addEventListener("DOMContentLoaded", () => {
        let firstName = localStorage.getItem("adminFirstName");
        let lastName = localStorage.getItem("adminLastName") || "";

        // Fallback: Extract from JWT Token if name is missing or still "Admin"
        const token = localStorage.getItem("authToken");
        if (token && (!firstName || firstName === "Admin")) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join(''));
                const payload = JSON.parse(jsonPayload);
                
                // Dynamically find keys ending in 'givenname' and 'surname'
                const givenNameKey = Object.keys(payload).find(k => k.endsWith('givenname'));
                const surnameKey = Object.keys(payload).find(k => k.endsWith('surname'));
                
                const givenName = givenNameKey ? payload[givenNameKey] : "";
                const surname = surnameKey ? payload[surnameKey] : "";
                
                if (givenName) {
                    firstName = givenName;
                    lastName = firstName.includes(surname) ? "" : surname;
                    localStorage.setItem("adminFirstName", firstName);
                    localStorage.setItem("adminLastName", lastName);
                }
            } catch (e) {
                console.error("Failed to decode token for name", e);
            }
        }

        if (!firstName) firstName = "Admin";
        const fullName = `${firstName} ${lastName}`.trim();

        // Get first letter of first name and last name
        const initial1 = firstName.charAt(0).toUpperCase();
        let initial2 = lastName ? lastName.charAt(0).toUpperCase() : "";
        if (!initial2 && firstName.includes(" ")) {
            const parts = firstName.split(" ");
            initial2 = parts[parts.length - 1].charAt(0).toUpperCase();
        }
        const initials = initial1 + initial2;

        // Target the username text element
        const nameElements = document.querySelectorAll(".header-user .body-title");
        nameElements.forEach(el => {
            el.textContent = fullName;
        });

        // Target the image wrapper and replace the <img> with a generated initials circle
        const avatarWrappers = document.querySelectorAll(".header-user .image");
        avatarWrappers.forEach(wrapper => {
            wrapper.innerHTML = `<div style="width: 45px; height: 45px; border-radius: 50%; background-color: #2377FC; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 18px; letter-spacing: 1px;">${initials}</div>`;
        });
    });
})();