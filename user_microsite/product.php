<?php
$pageTitle = 'Product Details';
$currentPage = 'product';
include '_header.php';
?>

<section class="card p-4 shadow-sm mb-4" id="msProductSection">
    <div class="row g-4">
        <div class="col-md-6">
            <img id="msProductImage" class="img-fluid rounded" src="" alt="Product" style="display:none;">
        </div>
        <div class="col-md-6">
            <p class="text-muted mb-1" id="msProductCategory">Product</p>
            <h1 class="h3" id="msProductTitle">Product</h1>
            <div class="h4 my-3" id="msProductPrice">₹0</div>
            <p class="mb-2"><strong>Availability:</strong> <span id="msProductStock">-</span></p>
            <p id="msProductDesc" class="text-muted">Loading product details...</p>
            <button type="button" class="btn ms-btn mt-2" id="msAddToCartBtn">Add to Cart</button>
            <a href="index.php<?php echo htmlspecialchars($msQuery, ENT_QUOTES, 'UTF-8'); ?>" class="btn btn-link mt-2">Back to Home</a>
        </div>
    </div>
    <p id="msProductEmpty" class="text-danger mt-3" style="display:none;">Product not found for this microsite.</p>
</section>

<?php include '_footer.php'; ?>
