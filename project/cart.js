class Cart {
    constructor() {
        this.items = this.loadCart();
        this.initializeCart();
        this.updateCartCount();
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        this.renderCart();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.saveCart();
            this.renderCart();
        }
    }

    calculateTotal() {
        const subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? 20 : 0;
        return {
            subtotal,
            shipping,
            total: subtotal + shipping
        };
    }

    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = count;
        }
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;

        cartItems.innerHTML = '';

        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
            return;
        }

        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">R$ ${item.price.toFixed(2)}</p>
                    <div class="item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                        <i class="fas fa-trash remove-item" onclick="cart.removeItem('${item.id}')"></i>
                    </div>
                </div>
            `;
            cartItems.appendChild(itemElement);
        });

        const { subtotal, shipping, total } = this.calculateTotal();
        document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `R$ ${shipping.toFixed(2)}`;
        document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;
    }

    initializeCart() {
        if (window.location.pathname.includes('cart.html')) {
            this.renderCart();
        }
    }
}

const cart = new Cart();

// Update the index.html add-to-cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const product = {
            id: Math.random().toString(36).substr(2, 9),
            name: productCard.querySelector('h3').textContent,
            price: parseFloat(productCard.querySelector('.price').textContent.replace('R$ ', '')),
            image: productCard.querySelector('img').src
        };
        cart.addItem(product);
    });
});