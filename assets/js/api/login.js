function goToForgotPassword(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    window.location.href = "forgot-password.php";
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".forgot-link, #forgotPasswordLink").forEach((link) => {
        link.addEventListener("click", goToForgotPassword);
        const href = (link.getAttribute("href") || "").trim();
        if (!href || href === "#") {
            link.setAttribute("href", "forgot-password.php");
        }
    });
    const token = localStorage.getItem("token");
    let userName = localStorage.getItem("userName") || "My Account";

    // Decode the token to get the full name dynamically on page load
    if (token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
            const payload = JSON.parse(jsonPayload);
            
            // Grab first and last name from token claims
            const givenNameKey = Object.keys(payload).find(k => k.toLowerCase().includes('givenname') || k.toLowerCase() === 'firstname');
            const surnameKey = Object.keys(payload).find(k => k.toLowerCase().includes('surname') || k.toLowerCase() === 'lastname');
            
            let fName = givenNameKey ? payload[givenNameKey] : userName;
            let lName = surnameKey ? payload[surnameKey] : "";
            
            userName = `${fName} ${lName}`.trim() || userName;
        } catch (err) {
            console.error("Could not parse token to get full name", err);
        }
    }

    const headerLoginLink = document.querySelector('a[href="#signin-modal"]');
    if (token && headerLoginLink) {
        const parentLi = headerLoginLink.parentElement;
        parentLi.innerHTML = `
            <a href="dashboard.php" style="display:inline-block;margin-right:15px;">
                <i class="icon-user"></i>Hi, ${userName}
            </a>
            <a href="#" id="logoutBtn" style="display:inline-block;cursor:pointer;">
                Logout
            </a>
        `;

        document.getElementById("logoutBtn").addEventListener("click", function(e) {
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");

            iziToast.success({
                title: "Logged out",
                message: "You have been logged out",
                position: "topRight"
            });

            setTimeout(() => location.reload(), 1200);
        });
    }

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("singin-email").value.trim();
            const password = document.getElementById("singin-password").value.trim();

            if (!email || !password) {
                iziToast.warning({
                    title: "Required",
                    message: "Please enter email and password",
                    position: "topRight"
                });
                return;
            }

            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);

            const btnSubmit = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<span>Logging in...</span>';
            btnSubmit.disabled = true;

            try {
                const res = await fetch(`${domain}/api/users/login`, {
                    method: "POST",
                    body: formData
                });

                const data = await res.json();
                const token = data.data ? data.data.token : data.token;

                if (data.status && token) {
                    localStorage.setItem("token", token);

                    // Grab both first and last name and save it as the full name
                    const firstName = data.data?.firstname || data.data?.firstName || "User";
                    const lastName = data.data?.lastname || data.data?.lastName || "";
                    const fullName = `${firstName} ${lastName}`.trim();
                    localStorage.setItem("userName", fullName);
                    localStorage.setItem("userEmail", email);

                    iziToast.success({
                        title: "Success",
                        message: "Login successful",
                        position: "topRight"
                    });

                    setTimeout(() => location.reload(), 1200);
                } else {
                    iziToast.error({
                        title: "Error",
                        message: data.message || "Invalid credentials",
                        position: "topRight"
                    });
                }
            } catch (error) {
                console.error("Login Error:", error);
                iziToast.error({
                    title: "Server Error",
                    message: "Error during login",
                    position: "topRight"
                });
            } finally {
                btnSubmit.innerHTML = originalBtnText;
                btnSubmit.disabled = false;
            }
        });
    }
});
