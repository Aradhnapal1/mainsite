<?php
$pageTitle = 'Cart';
$currentPage = 'cart';
include '_header.php';
?>

<section class="card p-4 shadow-sm">
    <h2 class="mb-3">Cart</h2>
    <p id="msCartEmpty" class="text-muted" style="display:none;">Cart empty hai.</p>
    <div class="table-responsive">
        <table class="table align-middle">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="msCartBody"></tbody>
        </table>
    </div>
    <div class="d-flex justify-content-between align-items-center mt-3">
        <strong>Grand Total: <span id="msCartTotal">₹0</span></strong>
        <a href="checkout.php<?php echo htmlspecialchars($msQuery, ENT_QUOTES, 'UTF-8'); ?>" class="btn ms-btn">Go To Checkout</a>
    </div>
</section>

<?php include '_footer.php'; ?>
