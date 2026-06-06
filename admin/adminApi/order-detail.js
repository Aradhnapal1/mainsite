document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    if (orderId && document.getElementById('order-items-list')) {
        loadOrderDetails(orderId);
    }
});

function extractOrderFromResponse(result) {
    if (!result || typeof result !== "object") return null;
    if (result.order && typeof result.order === "object") return result.order;
    if (result.data?.order && typeof result.data.order === "object") return result.data.order;
    if (result.data && typeof result.data === "object" && !Array.isArray(result.data)) {
        if (result.data.id != null || result.data.orderId != null) return result.data;
    }
    return null;
}

function extractOrderItemsFromResponse(result) {
    if (!result || typeof result !== "object") return [];
    const items = result.orderItems || result.data?.orderItems || result.items || result.data?.items;
    return Array.isArray(items) ? items : [];
}

async function fetchAdminOrderFromList(id, token) {
    const response = await fetch(`${domin}/api/checkout/admin/allorders`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) return null;

    const result = await response.json();
    const orders = normalizeApiList(result);
    return orders.find((o) => String(o.id || o.orderId) === String(id)) || null;
}

async function loadOrderDetails(id) {
    const token = localStorage.getItem("authToken");
    if (!token) {
        iziToast.error({ title: "Error", message: "Not authenticated", position: "topRight" });
        return;
    }

    try {
        let order = null;
        let items = [];

        const detailResponse = await fetch(`${domin}/api/checkout/order/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const detailResult = await detailResponse.json();

        order = extractOrderFromResponse(detailResult);
        items = extractOrderItemsFromResponse(detailResult);

        if (!order) {
            order = await fetchAdminOrderFromList(id, token);
        }

        if (!order) {
            iziToast.error({
                title: "Error",
                message: detailResult.message || "Order not found",
                position: "topRight"
            });
            return;
        }

        if (!items.length) {
            items = order.orderItems || order.items || [];
        }

        const grandTotal = Number(order.grandTotal ?? order.totalAmount ?? order.total ?? 0);
        const createdAt = order.createdAt || order.createdat || order.orderDate;
        const orderDate = createdAt
            ? new Date(createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : '-';

        const firstName = order.firstName || order.firstname || '';
        const lastName = order.lastName || order.lastname || '';
        const email = order.email || order.Email || '-';
        const mobile = order.mobile || order.phone || order.Phone || '-';
        const address = order.address || order.Address || '';
        const city = order.city || order.City || '';
        const state = order.state || order.State || '';
        const country = order.country || order.Country || '';
        const pincode = order.pincode || order.pinCode || order.Pincode || '';
        const paymentMethod = order.paymentMethod || order.paymentmethod || '-';

        let statusText = order.orderStatus || order.status || 'Pending';
        statusText = String(statusText).charAt(0).toUpperCase() + String(statusText).slice(1);
        let statusBadge = `<span class="badge bg-warning text-dark" style="padding: 4px 10px; font-size: 12px; border-radius: 4px; font-weight: 600;">${statusText}</span>`;

        if (statusText.toLowerCase() === 'delivered' || statusText.toLowerCase() === 'success') {
            statusBadge = `<span class="badge bg-success" style="padding: 4px 10px; font-size: 12px; border-radius: 4px; color: #fff; font-weight: 600;">${statusText}</span>`;
        } else if (statusText.toLowerCase() === 'cancelled' || statusText.toLowerCase() === 'failed') {
            statusBadge = `<span class="badge bg-danger" style="padding: 4px 10px; font-size: 12px; border-radius: 4px; color: #fff; font-weight: 600;">${statusText}</span>`;
        }

        setText('order-page-title', `Order #${order.id || id}`);
        setText('breadcrumb-order-id', `Order #${order.id || id}`);
        setText('summary-order-id', `#${order.id || id}`);
        setText('summary-date', orderDate);
        document.getElementById('summary-status').innerHTML = statusBadge;
        setText('summary-total', `₹${grandTotal.toFixed(2)}`);
        setText('cart-subtotal', `₹${grandTotal.toFixed(2)}`);
        setText('cart-total', `₹${grandTotal.toFixed(2)}`);
        setText('payment-method', paymentMethod);

        const addressText = `<b>${firstName} ${lastName}</b><br>${address}<br>${city}${city && state ? ', ' : ''}${state}<br>${country}${pincode ? ` - ${pincode}` : ''}<br><br><b>Mobile:</b> ${mobile}<br><b>Email:</b> ${email}`;
        const addressEl = document.getElementById('shipping-address');
        if (addressEl) addressEl.innerHTML = addressText;

        const itemsList = document.getElementById('order-items-list');
        itemsList.innerHTML = '';

        if (!items.length) {
            itemsList.innerHTML = '<li class="body-text">No products found in this order.</li>';
            return;
        }

        items.forEach(item => {
            const productName = item.productName || item.ProductName || item.name || 'Product';
            const quantity = item.quantity ?? item.Quantity ?? 0;
            const totalPrice = Number(item.totalPrice ?? item.TotalPrice ?? item.price ?? 0);
            const imgUrl = item.image ? resolveAdminAssetUrl(item.image) : "images/products/default.png";

            const row = `
                <li class="product-item gap14">
                    <div class="image no-bg">
                        <img src="${imgUrl}" alt="${productName}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                    </div>
                    <div class="flex items-center justify-between gap40 flex-grow">
                        <div class="name" style="flex: 1;">
                            <div class="text-tiny mb-1">Product Name</div>
                            <a href="javascript:void(0);" class="body-title-2">${productName}</a>
                        </div>
                        <div class="name" style="flex: 0 0 80px;">
                            <div class="text-tiny mb-1">Quantity</div>
                            <div class="body-title-2">${quantity}</div>
                        </div>
                        <div class="name" style="flex: 0 0 100px;">
                            <div class="text-tiny mb-1">Total</div>
                            <div class="body-title-2 tf-color-1">₹${totalPrice.toFixed(2)}</div>
                        </div>
                    </div>
                </li>
            `;
            itemsList.insertAdjacentHTML('beforeend', row);
        });

    } catch (error) {
        console.error(error);
        iziToast.error({ title: "Error", message: "Failed to fetch order details", position: "topRight" });
    }
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}
