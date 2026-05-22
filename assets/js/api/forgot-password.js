document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".forgot-link").forEach((link) => {
        const href = (link.getAttribute("href") || "").trim();
        if (!href || href === "#") {
            link.setAttribute("href", "forgot-password.php");
        }
    });

    const forgotPanel = document.getElementById("forgotPasswordPanel");
    const forgotPage = document.getElementById("forgotPasswordPage");

    if (!forgotPanel) return;

    const stepEmail = document.getElementById("forgotStepEmail");
    const stepOtp = document.getElementById("forgotStepOtp");
    const stepNewPassword = document.getElementById("forgotStepNewPassword");

    const emailInput = document.getElementById("forgot-email");
    const otpInput = document.getElementById("forgot-otp");
    const newPasswordInput = document.getElementById("forgot-new-password");
    const confirmPasswordInput = document.getElementById("forgot-confirm-password");

    const sendOtpBtn = document.getElementById("forgotSendOtpBtn");
    const verifyOtpBtn = document.getElementById("forgotVerifyOtpBtn");
    const resetPasswordBtn = document.getElementById("forgotResetPasswordBtn");

    const isPageMode = !!forgotPage;
    let resetEmail = "";

    function showToast(type, title, message) {
        if (typeof iziToast === "undefined") return;
        iziToast[type]({ title, message, position: "topRight" });
    }

    function showForgotStep(step) {
        if (stepEmail) stepEmail.style.display = step === "email" ? "block" : "none";
        if (stepOtp) stepOtp.style.display = step === "otp" ? "block" : "none";
        if (stepNewPassword) stepNewPassword.style.display = step === "password" ? "block" : "none";
    }

    showForgotStep("email");
    forgotPanel.style.display = "block";

    async function postJson(url, body) {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        let data = {};
        try {
            data = await res.json();
        } catch (e) {
            data = {};
        }
        return { res, data };
    }

    if (sendOtpBtn) {
        sendOtpBtn.addEventListener("click", async () => {
            const email = (emailInput?.value || "").trim();
            if (!email) {
                showToast("warning", "Required", "Please enter your email");
                return;
            }

            resetEmail = email;
            const original = sendOtpBtn.innerHTML;
            sendOtpBtn.disabled = true;
            sendOtpBtn.innerHTML = "<span>Sending...</span>";

            try {
                const { res, data } = await postJson(`${domain}/api/users/forgotpassword`, { email });
                if (res.ok && data.status) {
                    showToast("success", "OTP Sent", data.message || "OTP sent to your email");
                    showForgotStep("otp");
                } else {
                    showToast("error", "Error", data.message || "Failed to send OTP");
                }
            } catch (err) {
                console.error(err);
                showToast("error", "Server Error", "Could not send OTP");
            } finally {
                sendOtpBtn.innerHTML = original;
                sendOtpBtn.disabled = false;
            }
        });
    }

    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener("click", async () => {
            const email = resetEmail || (emailInput?.value || "").trim();
            const otp = (otpInput?.value || "").trim();
            if (!email || !otp) {
                showToast("warning", "Required", "Email and OTP are required");
                return;
            }

            resetEmail = email;
            const original = verifyOtpBtn.innerHTML;
            verifyOtpBtn.disabled = true;
            verifyOtpBtn.innerHTML = "<span>Verifying...</span>";

            try {
                const { res, data } = await postJson(`${domain}/api/users/verifyforgotpasswordotp`, { email, otp });
                if (res.ok && data.status && data.verified) {
                    showToast("success", "Verified", data.message || "OTP verified");
                    showForgotStep("password");
                } else {
                    showToast("error", "Invalid OTP", data.message || "OTP verification failed");
                }
            } catch (err) {
                console.error(err);
                showToast("error", "Server Error", "Could not verify OTP");
            } finally {
                verifyOtpBtn.innerHTML = original;
                verifyOtpBtn.disabled = false;
            }
        });
    }

    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener("click", async () => {
            const email = resetEmail || (emailInput?.value || "").trim();
            const otp = (otpInput?.value || "").trim();
            const newPassword = (newPasswordInput?.value || "").trim();
            const confirmPassword = (confirmPasswordInput?.value || "").trim();

            if (!email || !otp || !newPassword || !confirmPassword) {
                showToast("warning", "Required", "All fields are required");
                return;
            }

            if (newPassword !== confirmPassword) {
                showToast("warning", "Mismatch", "Passwords do not match");
                return;
            }

            const original = resetPasswordBtn.innerHTML;
            resetPasswordBtn.disabled = true;
            resetPasswordBtn.innerHTML = "<span>Updating...</span>";

            try {
                const { res, data } = await postJson(`${domain}/api/users/resetpassword`, {
                    email,
                    otp,
                    newPassword,
                    confirmPassword
                });

                if (res.ok && data.status) {
                    showToast("success", "Success", data.message || "Password updated");
                    if (isPageMode) {
                        setTimeout(() => {
                            window.location.href = "index.php";
                        }, 1500);
                    }
                } else {
                    showToast("error", "Error", data.message || "Password update failed");
                }
            } catch (err) {
                console.error(err);
                showToast("error", "Server Error", "Could not update password");
            } finally {
                resetPasswordBtn.innerHTML = original;
                resetPasswordBtn.disabled = false;
            }
        });
    }
});
