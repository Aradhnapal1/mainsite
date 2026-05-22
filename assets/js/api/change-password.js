document.addEventListener("DOMContentLoaded", () => {
    const changePasswordForm = document.getElementById("changePasswordForm");

    if (changePasswordForm) {
        changePasswordForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const oldPassword = document.getElementById("oldPassword").value.trim();
            const newPassword = document.getElementById("newPassword").value.trim();
            const confirmPassword = document.getElementById("confirmPassword").value.trim();

            if (!oldPassword || !newPassword || !confirmPassword) {
                iziToast.warning({ title: "Required", message: "All fields are required.", position: "topRight" });
                return;
            }

            if (newPassword !== confirmPassword) {
                iziToast.warning({ title: "Mismatch", message: "New passwords do not match.", position: "topRight" });
                return;
            }

            const submitBtn = changePasswordForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Resetting...';
            submitBtn.disabled = true;

            const token = localStorage.getItem("token");
            if (!token) {
                iziToast.error({ title: "Error", message: "You are not logged in.", position: "topRight" });
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                return;
            }
            
            // Attempt to get the email from local storage or decode it from the JWT token
            let userEmail = localStorage.getItem("userEmail") || ""; 
            if (!userEmail && token) {
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
                        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                    ).join(''));
                    const payload = JSON.parse(jsonPayload);
                    
                    // Grab common keys for email usually found in a JWT token
                    const emailKey = Object.keys(payload).find(k => k.toLowerCase().includes('emailaddress') || k.toLowerCase().endsWith('email'));
                    userEmail = payload.email || payload.Email || (emailKey ? payload[emailKey] : "");
                } catch (err) {
                    console.error("Could not parse token to get email", err);
                }
            }

            try {
                const apiBase = typeof domain !== 'undefined' ? domain : 'http://microsite_backend.workarya.com';
                const res = await fetch(`${apiBase}/api/users/changepassword`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        oldPassword: oldPassword,
                        newPassword: newPassword,
                        confirmPassword: confirmPassword
                    })
                });

                const data = await res.json();

                if (res.ok && (data.status === true || data.status === "success")) {
                    iziToast.success({ title: "Success", message: data.message || "Password changed successfully!", position: "topRight" });
                    changePasswordForm.reset();
                } else {
                    iziToast.error({ title: "Error", message: data.message || "Failed to change password.", position: "topRight" });
                }
            } catch (err) {
                console.error("Change password error:", err);
                iziToast.error({ title: "Server Error", message: "Something went wrong while changing the password.", position: "topRight" });
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});