<?php
$pageTitle = 'User Register';
$currentPage = 'register';
include '_header.php';
?>

<section class="card p-4 shadow-sm mx-auto" style="max-width:480px;">
    <h2 class="mb-3">User Register</h2>
    <p class="text-muted small">Name aur email dal kar OTP verify karein.</p>

    <div class="mb-3">
        <label class="form-label" for="msAuthName">Full Name</label>
        <input type="text" class="form-control" id="msAuthName" placeholder="Your name" required>
    </div>

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
        <button type="button" class="btn btn-outline-secondary" id="msVerifyOtpBtn">Verify &amp; Register</button>
    </div>

    <p class="mt-3 mb-0 small">
        Pehle se account hai?
        <a href="login.php<?php echo htmlspecialchars($msQuery, ENT_QUOTES, 'UTF-8'); ?>">Login</a>
    </p>
</section>

<?php include '_footer.php'; ?>
