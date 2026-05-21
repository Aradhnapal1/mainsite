<?php
$pageTitle = 'Microsite Home';
$currentPage = 'home';
include '_header.php';
?>

<section class="mb-4">
    <img id="msBanner" class="ms-banner" src="" alt="Banner" style="display:none;">
</section>

<section class="card p-4 shadow-sm mb-4">
    <h1 id="msHeading">Microsite Heading</h1>
    <p id="msContent" class="mb-0">Microsite content will be loaded from backend values.</p>
</section>

<div class="ms-featured-wrap" id="msProductsSection">
    <div class="container-fluid px-3 px-lg-4">
        <div class="heading heading-center mb-3">
            <h2 class="title">FEATURED PRODUCTS</h2>
        </div>
        <div class="ms-carousel-shell">
            <button type="button" class="ms-carousel-btn ms-carousel-prev" id="msCarouselPrev" aria-label="Previous products">
                <span aria-hidden="true">‹</span>
            </button>
            <div class="ms-products-viewport">
                <div id="msProducts" class="ms-products-track"></div>
            </div>
            <button type="button" class="ms-carousel-btn ms-carousel-next" id="msCarouselNext" aria-label="Next products">
                <span aria-hidden="true">›</span>
            </button>
        </div>
        <div class="ms-carousel-dots" id="msCarouselDots"></div>
        <p id="msProductsEmpty" class="ms-products-empty" style="display:none;">This microsite do not have products.</p>
    </div>
</div>

<?php include '_footer.php'; ?>
