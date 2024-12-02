function goToProductDetail(productId) {
    localStorage.setItem('selectedProductId', productId);
    window.location.href = 'product-detail.html'; 
}

function loadProductDetail() {
    console.log("loadProductDetail")
    const productId = localStorage.getItem('selectedProductId');
    console.log("productId = ",productId)
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


document.getElementById('checkout-button')?.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkboxes = document.querySelectorAll('.item-checkbox');
    let selectedItems = [];


    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const index = checkbox.dataset.index;
            selectedItems.push(cart[index]);
        }
    });

    var list_product = []
    var total = 0
    

    if (selectedItems.length > 0) {
        selectedItems.forEach(item => {
            list_product.push({
                name:item.name, 
                price:item.price
            })
            // Create and insert product details into the order summary
            // const productItem = document.createElement('p');
            // productItem.textContent = `${item.name} - $${item.price}`;
            // orderSummary.insertBefore(productItem, totalPriceElement); // Insert before total price
            // Calculate total price
            total += item.price;
        });
        console.log("list_product = ",list_product)
        localStorage.setItem('listProductPayment', JSON.stringify(list_product));
        localStorage.setItem('totalPayment', total);
        window.location.href= "payment.html"

        // totalPriceElement.textContent = `Total: $${total}`;
    } else {
        alert("Please select at least one item to proceed.");
    }
});


document.querySelector('.payment-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Payment Successful! Thank you for your purchase.');
    localStorage.removeItem('selectedItems'); // Clear selected items after purchase
    localStorage.removeItem('cart'); // Clear the entire cart after purchase
    window.location.href = 'index.html'; // Redirect to home or shop page
});



document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded")
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
    if (window.location.pathname.includes('payment.html')) {
        console.log("payment.html")
        // Ensure that #order-summary and #total-price elements exist before proceeding
        const orderSummary = document.getElementById('order-summary');
        const totalPriceElement = document.getElementById('total-price');

        const listProductPayment = JSON.parse(localStorage.getItem('listProductPayment'));
        listProductPayment.forEach((item) => {
            const productItem = document.createElement('p');
            productItem.textContent = `${item.name} - $${item.price}`;
            orderSummary.insertBefore(productItem, totalPriceElement); 
        })

        const totalPayment = localStorage.getItem('totalPayment')
        totalPriceElement.textContent = `Total: $${totalPayment}`;

        // Retrieve selected items from localStorage
        const selectedItems = JSON.parse(localStorage.getItem('selectedItems')) || [];
        console.log("Selected Items:", selectedItems);
    }
  }
);