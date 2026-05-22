<?php
if (!isset($pageTitle)) {
    $pageTitle = 'Microsite';
}
if (!isset($currentPage)) {
    $currentPage = 'home';
}
$activeSlug = isset($_GET['slug']) ? trim((string)$_GET['slug']) : '';
$activeDomain = isset($_GET['domain']) ? trim((string)$_GET['domain']) : '';
$activeMicrositeId = isset($_GET['microsite_id']) ? trim((string)$_GET['microsite_id']) : '';

function msContextQuery(): string
{
    global $activeMicrositeId, $activeSlug, $activeDomain;
    if ($activeMicrositeId !== '') {
        return '?microsite_id=' . urlencode($activeMicrositeId);
    }
    if ($activeSlug !== '') {
        return '?slug=' . urlencode($activeSlug);
    }
    if ($activeDomain !== '') {
        return '?domain=' . urlencode($activeDomain);
    }
    return '';
}

$msQuery = msContextQuery();
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$isLocalHost = in_array($host, ['localhost', '127.0.0.1'], true);
$useLocalApi = isset($_GET['localapi']) && $_GET['localapi'] === '1';
if ($useLocalApi) {
    $micrositeApiBase = 'https://localhost:7161';
} elseif ($isLocalHost) {
    $micrositeApiBase = 'http://microsite_backend.workarya.com';
} else {
    $micrositeApiBase = '';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title><?php echo htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?></title>
    <meta name="description" content="Microsite page">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="microsite-layout.css">
    <link rel="stylesheet" href="microsite-products.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/izitoast/dist/css/iziToast.min.css">
    <script>
        (function () {
            var params = new URLSearchParams(window.location.search);
            var apiBase = <?php echo json_encode($micrositeApiBase); ?>;
            window.MICROSITE_API_BASE = apiBase || window.location.origin;
            window.MICROSITE_CONTEXT = {
                micrositeId: params.get("microsite_id") || <?php echo json_encode($activeMicrositeId); ?>,
                slug: params.get("slug") || <?php echo json_encode($activeSlug); ?>,
                domain: params.get("domain") || <?php echo json_encode($activeDomain); ?>,
                currentPage: <?php echo json_encode($currentPage); ?>
            };
        })();
    </script>
</head>
<body>
<header class="ms-header py-3 mb-4">
    <div class="container d-flex justify-content-between align-items-center flex-wrap gap-2">
        <a href="index.php<?php echo htmlspecialchars($msQuery, ENT_QUOTES, 'UTF-8'); ?>" class="text-decoration-none d-flex align-items-center text-reset ms-nav-home">
            <img id="msLogo" class="ms-logo me-2" src="" alt="Logo" style="display:none;">
            <strong id="msSiteName">Microsite</strong>
        </a>
        <nav class="d-flex flex-wrap gap-2 gap-md-3 ms-header-nav">
            <a class="text-reset ms-nav-home" href="index.php<?php echo htmlspecialchars($msQuery, ENT_QUOTES, 'UTF-8'); ?>">Home</a>
            <a class="text-reset" href="contact.php<?php echo htmlspecialchars($msQuery, ENT_QUOTES, 'UTF-8'); ?>">Contact</a>
            <a class="text-reset" href="login.php<?php echo htmlspecialchars($msQuery, ENT_QUOTES, 'UTF-8'); ?>" id="msNavLogin">Login</a>
            <a class="text-reset" href="register.php<?php echo htmlspecialchars($msQuery, ENT_QUOTES, 'UTF-8'); ?>" id="msNavRegister">Register</a>
            <a class="text-reset ms-cart-link" href="cart.php<?php echo htmlspecialchars($msQuery, ENT_QUOTES, 'UTF-8'); ?>" title="Cart" aria-label="Cart">
                <i class="icon-shopping-cart"></i>
                <span class="ms-cart-badge" id="msCartBadge">0</span>
            </a>
            <a class="text-reset" href="checkout.php<?php echo htmlspecialchars($msQuery, ENT_QUOTES, 'UTF-8'); ?>">Checkout</a>
            <a class="text-reset" href="order.php<?php echo htmlspecialchars($msQuery, ENT_QUOTES, 'UTF-8'); ?>">Order</a>
        </nav>
    </div>
</header>
<main class="container pb-5">
