<?php
/** Main site password reset UI — uses /api/users/forgotpassword (not microsite OTP login). */
$forgotMode = isset($forgotMode) ? $forgotMode : 'modal';
$isPage = ($forgotMode === 'page');
?>
<div id="forgotPasswordPanel" <?php echo $isPage ? '' : 'style="display:none;"'; ?>>
    <p class="text-center mb-2"><strong>Reset Password</strong></p>
    <div id="forgotStepEmail">
        <div class="form-group">
            <label for="forgot-email">Email address *</label>
            <input type="email" class="form-control" id="forgot-email" required>
        </div>
        <button type="button" class="btn btn-outline-primary-2 btn-block" id="forgotSendOtpBtn">
            <span>Send OTP</span>
        </button>
    </div>
    <div id="forgotStepOtp" style="display:none;">
        <div class="form-group">
            <label for="forgot-otp">Enter OTP *</label>
            <input type="text" class="form-control" id="forgot-otp" maxlength="6" inputmode="numeric" placeholder="6 digit OTP" required>
        </div>
        <button type="button" class="btn btn-outline-primary-2 btn-block" id="forgotVerifyOtpBtn">
            <span>Verify OTP</span>
        </button>
    </div>
    <div id="forgotStepNewPassword" style="display:none;">
        <div class="form-group">
            <label for="forgot-new-password">New Password *</label>
            <input type="password" class="form-control" id="forgot-new-password" required>
        </div>
        <div class="form-group">
            <label for="forgot-confirm-password">Confirm Password *</label>
            <input type="password" class="form-control" id="forgot-confirm-password" required>
        </div>
        <button type="button" class="btn btn-outline-primary-2 btn-block" id="forgotResetPasswordBtn">
            <span>Update Password</span>
        </button>
    </div>
    <p class="text-center mt-3 mb-0">
        <?php if ($isPage): ?>
            <a href="index.php#signin-modal">Back to Sign In</a>
        <?php else: ?>
            <a href="#" id="forgotBackToLogin">Back to Sign In</a>
        <?php endif; ?>
    </p>
</div>
