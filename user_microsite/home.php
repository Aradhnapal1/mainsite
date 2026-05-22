<?php
$pageTitle = 'Microsite Home';
$currentPage = 'home';
include '_header.php';
?>

<section class="mb-4">
    <img id="msBanner" class="ms-banner" src="../assets/images/demos/demo-7/banners/banner-1.jpg" alt="Banner">
</section>

<section class="mb-5">
    <div class="ms-welcome-box shadow-sm">
        <h1 id="msHeading" class="h2 mb-3">Microsite Heading</h1>
        <p id="msContent" class="mb-0 text-muted">Microsite content will be loaded from backend values.</p>
    </div>
</section>

<section class="ms-featured bg-light py-5 mb-4">
    <div class="container-fluid">
        <div class="heading heading-center mb-4">
            <h2 class="title">FEATURED PRODUCTS</h2>
        </div>
        <div class="products">
            <div class="row justify-content-center" id="featured-products-row">
                <!-- Products loaded by microsite-products.js -->
            </div>
        </div>
    </div>
</section>

<?php include '_footer.php'; ?>
