<?php
$hideSigninModal = true;
include 'header.php';
?>

<main class="main">
    <div class="page-header text-center" style="background-image: url('assets/images/page-header-bg.jpg')">
        <div class="container">
            <h1 class="page-title">Forgot Password<span>Main Site</span></h1>
        </div>
    </div>

    <div class="page-content pb-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    <div class="form-box p-4 shadow-sm" id="forgotPasswordPage">
                        <p class="text-muted small mb-3">
                            Enter your registered email. We will send an OTP. After verification you can set a new password.
                        </p>
                        <?php
                        $forgotMode = 'page';
                        include '_forgot-password-panel.php';
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php include 'footer.php'; ?>
