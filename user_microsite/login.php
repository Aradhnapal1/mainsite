<?php
$pageTitle = 'User Login';
$currentPage = 'login';
include '_header.php';
?>

<section class="card p-4 shadow-sm mx-auto" style="max-width:480px;">
    <h2 class="mb-3">User Login</h2>
    <p class="text-muted small">Email par OTP aayega. OTP verify karke login ho jayenge.</p>

    <div class="mb-3">
        <label class="form-label" for="msAuthEmail">Email</label>
        <input type="email" class="form-control" id="msAuthEmail" placeholder="you@example.com" required>
    </div>

    <div class="mb-3">
        <label class="form-label" for="msAuthOtp">Email OTP</label>
        <input type="text" class="form-control" id="msAuthOtp" placeholder="6 digit OTP" maxlength="6" inputmode="numeric">
    </div>

    <div class="d-flex gap-2 flex-wrap">
        <button type="button" class="btn ms-btn" id="msSendOtpBtn">Send OTP</button>
        <button type="button" class="btn btn-outline-secondary" id="msVerifyOtpBtn">Verify &amp; Login</button>
    </div>

    <p class="mt-3 mb-0 small">
        Account nahi hai?
        <a href="register.php<?php echo htmlspecialchars($msQuery, ENT_QUOTES, 'UTF-8'); ?>">Register</a>
    </p>
</section>

<?php include '_footer.php'; ?>
