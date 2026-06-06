document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");

    if (!registerForm) return;

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmpassword").value.trim();
        const phone = document.getElementById("number").value.trim();

        if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
            iziToast.error({
                title: "Error",
                message: "All fields are required",
                position: "topRight"
            });
            return;
        }

        if (password !== confirmPassword) {
            iziToast.error({
                title: "Error",
                message: "Passwords do not match",
                position: "topRight"
            });
            return;
        }

        const formData = new FormData();
        formData.append("FirstName", firstName);
        formData.append("LastName", lastName);
        formData.append("Email", email);
        formData.append("Phone", phone);
        formData.append("PasswordHash", password);

        try {
            const response = await fetch(`${domin}/api/admin/add`, {
                method: "POST",
                body: formData
            });

            const contentType = response.headers.get("content-type");
            let data = {};
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                data = { message: text || "Unexpected server response" };
            }

            if (response.ok) {
                iziToast.success({
                    title: "Success",
                    message: data.message || "Admin registered successfully",
                    position: "topRight"
                });

                registerForm.reset();
                setTimeout(() => {
                    window.location.href = "login.php";
                }, 1200);
            } else {
                iziToast.error({
                    title: "Error",
                    message: data.message || "Failed to register",
                    position: "topRight"
                });
            }

        } catch (error) {
            console.error(error);
            iziToast.error({
                title: "Error",
                message: "Server error",
                position: "topRight"
            });
        }
    });
});
