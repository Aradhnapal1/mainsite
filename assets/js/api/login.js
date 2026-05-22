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

    // --- Handle Registration Form ---
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const firstName = document.getElementById("register-first-name").value.trim();
            const lastName = document.getElementById("register-last-name").value.trim();
            const email = document.getElementById("register-email").value.trim();
            const password = document.getElementById("register-password").value.trim();
            const policy = document.getElementById("register-policy").checked;

            if (!firstName || !lastName || !email || !password) {
                iziToast.warning({
                    title: "Required",
                    message: "All fields are required",
                    position: "topRight"
                });
                return;
            }

            if (!policy) {
                iziToast.warning({
                    title: "Required",
                    message: "Please agree to the privacy policy",
                    position: "topRight"
                });
                return;
            }

            const formData = new FormData();
            formData.append("Firstname", firstName);
            formData.append("Lastname", lastName);
            formData.append("Email", email);
            formData.append("Password", password);
            formData.append("Role", "USER");
            formData.append("Isactive", "true");

            const btnSubmit = registerForm.querySelector('button[type="submit"]');
            const originalBtnText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<span>SIGNING UP...</span>';
            btnSubmit.disabled = true;

            try {
                const apiBase = typeof domain !== 'undefined' ? domain : 'http://microsite_backend.workarya.com';
                const res = await fetch(`${apiBase}/api/users/adduser`, {
                    method: "POST",
                    body: formData
                });

                const data = await res.json();

                if (res.ok && data.status !== false && data.status !== "false" && data.status !== 0) {
                    iziToast.success({ title: "Success", message: data.message || "Registration successful! You can now log in.", position: "topRight" });
                    registerForm.reset();
                    document.getElementById('signin-tab')?.click(); // Automatically switch back to login tab
                } else {
                    iziToast.error({ title: "Error", message: data.message || "Registration failed", position: "topRight" });
                }
            } catch (error) {
                console.error("Registration Error:", error);
                iziToast.error({ title: "Server Error", message: "Something went wrong during registration.", position: "topRight" });
            } finally {
                btnSubmit.innerHTML = originalBtnText;
                btnSubmit.disabled = false;
            }
        });
    }
});
