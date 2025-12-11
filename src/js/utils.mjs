// import { createElement } from "react";

async function loadTemplate(path) {
    const res = await fetch(path);
    if(!res.ok)
    {
        console.error(`failded to load template:${path}`);
        return '';
    }
    return res;
    
}






async function loadHtml(params) {

    const responseHeader = await loadTemplate(params);
    const responseH = await responseHeader.text();
    return responseH;




    
}

export function getParams(itemsId) {

    const queryString = window.location.search;

    const urlparams =  new URLSearchParams(queryString);
    const requestedId =  urlparams.get(itemsId);
    console.log(requestedId);

    return requestedId;

    
}
export function renderWithTemplate(template,parentElement,data, callback){
    if(!parentElement) return;
    let html = template;
    if(callback) html = callback(template,data)
    parentElement.innerHTML = html;
  
}


export async function loadHeaderFooter(){

    try {


        

      const headerHtml = await loadHtml('/public/partials/header.html');

        
        const headerEl = document.getElementById('main-header')
        const footerEl = document.getElementById('main-footer')

        
            headerEl.innerHTML = headerHtml;
            
     const footerHtml = await loadHtml('/public/partials/footer.html');
        
         footerEl.innerHTML = footerHtml;
       
        
    } catch (err) {

        console.error('loadheaderFooter failed:', err)
        
    }
}

 const data = await fetchData('https://fakestoreapi.com/products');
 const mainC = document.getElementById('main-container');
   cardTemplate(mainC,data);

export async function fetchData(url) {

    try {
        const response = await fetch(url);

        if(!response.ok)  throw new Error(`Http error! status: ${response.status}`);
        const data = await response.json();
        console.log(data);
        return data;

        


        
    } catch (error) {

        console.error('Error fetching data:', error);
        
    }
    
}
  

export async function cardTemplate(element,datas) {


  datas.forEach(data => {
    
    const card = document.createElement('div');

    card.className = 'cardd'
    
    
    card.innerHTML =`
   

    <h3>${data.title}</h3>
    
    <img src="${data.image}" alt="${data.title}">

    <p> $${data.price}</p>
    <a class = 'links' href="/product-details/index.html?productId=${data.id}">More about prodocut</a>

 <button class='buy-btn'>Add To cart</button>




`

    element.appendChild(card);
  const buyBtn = card.querySelector('.buy-btn');
    buyBtn.addEventListener('click', () => {
      addToCart(data);
      alert(`${data.title} added to cart!`);
      updateCartCount();
    });
 

  
  });
   

}


// Initialize cart from local storage
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

// Save cart to local storage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  saveCart(cart);
}

// Remove item from cart
// Remove item from cart
export function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  displayCartItems();
  updateCartCount();
} 

// Clear entire cart
function clearCart() {
  localStorage.removeItem('cart');
}

// Get cart total
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// New function to display cart items
export function displayCartItems() {
  const cart = getCart();
  const cartItemsDiv = document.getElementById('cartItems');
  
  if (!cartItemsDiv) {
    console.log('cartItems element not found');
    return;
  }
  
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty</p>';
    return;
  }
  
  let html = '<table><tr><th>Item Name</th><th>Price</th><th>Quantity</th><th>Total</th><th>Action</th></tr>';
  
  cart.forEach(item => {
    html += `
      <tr>
        <td>${item.title}</td>
        <td>$${item.price}</td>
        <td>${item.quantity}</td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
       
      </tr>
    `;
  });
  
  html += '</table>';
  cartItemsDiv.innerHTML = html;
}

// Update cart count in header
function updateCartCount() {
  const cart = getCart();
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = `(${cart.length})`;
  }
}

const c = document.getElementById('cli');

if (c) {
  c.addEventListener('click', () => {
    displayCartItems();
  });
}