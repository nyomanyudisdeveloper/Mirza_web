function goToProductDetail(productId) {
    localStorage.setItem('selectedProductId', productId);
    window.location.href = 'product-detail.html'; 
}

function loadProductDetail() {
    const productId = localStorage.getItem('selectedProductId');
    const imagePath = `assets/images/product-${productId}.png`; // Placeholder image path
    if (productId) {
        // Simulated products for demo purposes
        const products = {
            1: { title: 'Product 1', description: 'This is Product 1', price: 10, img: imagePath},
            2: { title: 'Product 2', description: 'This is Product 2', price: 20, img: imagePath},
            3: { title: 'Product 3', description: 'This is Product 3', price: 30, img: imagePath},
            4: { title: 'Product 4', description: 'This is Product 4', price: 40, img: imagePath},
            5: { title: 'Product 5', description: 'This is Product 5', price: 50, img: imagePath},
            6: { title: 'Product 6', description: 'This is Product 6', price: 60, img: imagePath}
        };


        const product = products[productId];
        if (product) {
            document.getElementById('product-title').textContent = product.title;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('product-price-value').textContent = product.price;
            document.getElementById('product-img').src = product.img;
        }
    }
}

function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const imagePath = `assets/images/product-${id}.png`;
    cart.push({ id, name, price, img: imagePath}); 
    localStorage.setItem('cart', JSON.stringify(cart));  
    showModal(`${name} has been added to cart!`);
}

function loadCartItems() {
    console.log('load cart items');
   
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-container');
    console.log(cart);
   
    cartContainer.innerHTML = '';


    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
	  // template HTML code
        cartItem.innerHTML = `
            <input type="checkbox" class="item-checkbox" data-index="${index}" onchange="updateTotal()" >
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Quantity: 1</p>
            </div>
            <div class="cart-item-price">$${item.price}</div>
        `;
        cartContainer.appendChild(cartItem);
    });
}

function updateTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkboxes = document.querySelectorAll('.item-checkbox');
    let totalPrice = 0;


    // check if checkbox is checked
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const index = checkbox.dataset.index;
            // if checked then add price to total price
            totalPrice += cart[index].price;
        }
    });


    document.getElementById('total-price').textContent = `Total: $${totalPrice}`;
}

function showModal(message) {
    const modal = document.querySelector('.modal-container');
    const modalText = document.querySelector('.modal h3');
    modalText.textContent = message;
    modal.style.visibility = 'visible';
}
  
  
function hideModal(){
    const modal = document.querySelector('.modal-container');
    modal.style.visibility = 'hidden';
}


document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('product-detail.html')) {
        loadProductDetail();
         // Add code below to adding event listener for "Add to Cart" button
        document.getElementById('add-to-cart-button').addEventListener('click', () => {
            const productId = localStorage.getItem('selectedProductId');
            const productTitle = document.getElementById('product-title').textContent;
            const productPrice = document.getElementById('product-price-value').textContent;
            addToCart(productId, productTitle, parseFloat(productPrice));
        });
    }
    if (window.location.pathname.includes('cart')) {
        loadCartItems();
    }
  }
);
document.getElementById('checkout-button')?.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkboxes = document.querySelectorAll('.item-checkbox');
    let selectedItems = [];

    checkboxes.forEach(checkbox => {
        if (checkboxes.checked) {
            const index = checkbox.dataset.index;
            selectedItems.push(cart[index]);
        }
    });

    if (selectedItems.length > 0) {
        localStorage.setItem('selectedItems',JSON.stringify(selectedItems));
        window.location.href = 'payment.html';
    } else {
        alert("Please select at least one item to proceed.");
    }
});

if (window.location.pathname.includes('payment.html')) {
    const orderSummary = document.getElementById('order-summary');
    const totalPriceElement = document.getElementById('total-price');
   
    if (!orderSummary || !totalPriceElement) {
        console.error("Missing order-summary or total-price elements in the HTML.");
        return;
    }


    const selectedItems = JSON.parse(localStorage.getItem('selectedItems')) || [];
    console.log("Selected Items:", selectedItems);
    
    let total = 0;
    if (selectedItems.length === 0) {
        console.log("No items selected for purchase.");
    } else {
        selectedItems.forEach(item => {
            const productItem = document.createElement('p');
            productItem.textContent = `${item.name} - $${item.price}`;
            orderSummary.insertBefore(productItem, totalPriceElement);
            total += item.price;
        });
        totalPriceElement.textContent = `Total: $${total}`;
    }
    document.querySelector('.payment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Payment Successful! Thank you for your purchase.');
        localStorage.removeItem('selectedItems');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });