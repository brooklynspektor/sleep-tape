// ── Breathe Easy Cart ─────────────────────────────────
// Replace this URL with your actual Stripe payment link:
const STRIPE_URL = 'https://buy.stripe.com/YOUR_STRIPE_LINK_HERE';

let cart = [];

function loadCart() {
  try { cart = JSON.parse(localStorage.getItem('bp-cart') || '[]'); }
  catch(e) { cart = []; }
}

function saveCart() {
  localStorage.setItem('bp-cart', JSON.stringify(cart));
}

function cartTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function cartCount() {
  return cart.reduce((s, i) => s + i.qty, 0);
}

function updateBadge() {
  const n = cartCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = n;
    el.style.display = n > 0 ? 'flex' : 'none';
  });
}

function renderCart() {
  const el = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer-zone');
  if (!el) return;

  if (cart.length === 0) {
    el.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    if (footer) footer.style.display = 'none';
    updateBadge();
    return;
  }

  if (footer) footer.style.display = 'block';

  el.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.label}</div>
        <div class="cart-item-detail">${item.strips} strips</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
      <div class="cart-qty">
        <button onclick="updateQty(${i}, -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="updateQty(${i}, 1)">+</button>
      </div>
    </div>
  `).join('');

  const total = cartTotal();
  const amt = document.getElementById('cart-subtotal-amount');
  if (amt) amt.textContent = '$' + total.toFixed(2);

  const shipEl = document.getElementById('cart-free-ship');
  if (shipEl) {
    if (total >= 25) {
      shipEl.innerHTML = '<span style="color:var(--green);font-weight:700;">✓ You qualify for free shipping!</span>';
    } else {
      const diff = (25 - total).toFixed(2);
      shipEl.innerHTML = `<span>Add $${diff} more for free shipping</span>`;
    }
  }

  updateBadge();
}

function addToCart(id, label, bags, strips, price) {
  loadCart();
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, label, bags, strips, price, qty: 1 });
  }
  saveCart();
  renderCart();
  openCart();
}

function updateQty(index, delta) {
  loadCart();
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
}

function openCart() {
  loadCart();
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('open');
  renderCart();
}

function closeCart() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('open');
}

function goToCheckout() {
  window.location.href = STRIPE_URL;
}

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateBadge();
});
