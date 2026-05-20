document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("login-form");

    // ✅ LOGIN
    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const loginApi = `${domin}/api/admin/login`;
            const formData = new FormData(form);

            try {
                const response = await fetch(loginApi, {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();
                console.log("API Response:", data);

                if (response.ok && data.status === true) {

                    const token = data?.data?.token;
                    if (token) {
                        localStorage.setItem("authToken", token);
                        
                        // Store admin details for the header UI
                        let firstName = data?.data?.firstName || data?.data?.FirstName || data?.data?.name;
                        let lastName = data?.data?.lastName || data?.data?.LastName || "";

                        // Decode JWT token to get name if not provided in direct response
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
                            
                            if (!firstName && givenNameKey && payload[givenNameKey]) {
                                firstName = payload[givenNameKey];
                                const surname = surnameKey ? payload[surnameKey] : "";
                                lastName = firstName.includes(surname) ? "" : surname;
                            }
                        } catch (e) {
                            console.error("Token decoding failed", e);
                        }

                        localStorage.setItem("adminFirstName", firstName || "Admin");
                        localStorage.setItem("adminLastName", lastName);
                    }

                    iziToast.success({
                        title: 'Success',
                        message: data.message || 'Login successful!',
                        position: 'topRight',
                        timeout: 2000
                    });

                    setTimeout(() => {
                        window.location.href = "index.php";
                    }, 2000);

                } else {
                    iziToast.error({
                        title: 'Error',
                        message: data.message || "Login failed",
                        position: 'topRight'
                    });
                }

            } catch (error) {
                console.error(error);
                iziToast.error({
                    title: 'Error',
                    message: "Something went wrong",
                    position: 'topRight'
                });
            }
        });
    }

    // ✅ LOGOUT (SAFE CHECK)
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {

            // token remove
            localStorage.removeItem("authToken");
            localStorage.removeItem("adminFirstName");
            localStorage.removeItem("adminLastName");

            iziToast.success({
                title: 'Logged out',
                message: 'You have been logged out',
                position: 'topRight',
                timeout: 1500
            });

            setTimeout(() => {
                window.location.href = "login.php";
            }, 1000);
        });
    }

});