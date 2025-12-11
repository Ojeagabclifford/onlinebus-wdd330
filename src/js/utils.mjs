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

  const response = await loadTemplate(params);
  // loadTemplate returns a Response or an empty string on error
  if (!response || typeof response.text !== 'function') return '';
  const text = await response.text();
  return text;




    
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

    // Use configured base (import.meta.env.BASE_URL) so partials resolve correctly
    const base = import.meta.env.BASE_URL || '/';
    const headerUrl = `${base}partials/header.html`;
    console.log('[loadHeaderFooter] fetching header:', headerUrl);
    const headerHtml = await loadHtml(headerUrl);
    if (!headerHtml) console.warn('[loadHeaderFooter] headerHtml empty for', headerUrl);
    const headerEl = document.getElementById('main-header');
    const footerEl = document.getElementById('main-footer');
    if (headerEl) {
      headerEl.innerHTML = headerHtml;
      // Normalize links so they resolve correctly when site is served from a subpath
      headerEl.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;
        if (/^(https?:|mailto:|#)/.test(href)) return; // external/anchors
        // if already starts with base, keep
        if (href.startsWith(base)) return;
        // if root-absolute (starts with '/') and base is not '/', prefix base (remove trailing slash)
        if (href.startsWith('/')) {
          if (base !== '/') a.setAttribute('href', `${base.replace(/\/$/, '')}${href}`);
          return;
        }
        // relative href (./ or no leading slash): make it relative to base
        a.setAttribute('href', `${base}${href.replace(/^\.\//, '')}`);
      });
    }

    const footerUrl = `${base}partials/footer.html`;
    console.log('[loadHeaderFooter] fetching footer:', footerUrl);
    const footerHtml = await loadHtml(footerUrl);
    if (!footerHtml) console.warn('[loadHeaderFooter] footerHtml empty for', footerUrl);
    if (footerEl) {
      footerEl.innerHTML = footerHtml;
      footerEl.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;
        if (/^(https?:|mailto:|#)/.test(href)) return;
        if (href.startsWith(base)) return;
        if (href.startsWith('/')) {
          if (base !== '/') a.setAttribute('href', `${base.replace(/\/$/, '')}${href}`);
          return;
        }
        a.setAttribute('href', `${base}${href.replace(/^\.\//, '')}`);
      });
    }
       
        
    } catch (err) {

        console.error('loadheaderFooter failed:', err)
        
    }
}

// Initialize app in an async function (avoid top-level await)
export async function init() {
  try {
    await loadHeaderFooter();
  } catch (e) {
    // ignore
  }
  const data = await fetchData('https://fakestoreapi.com/products');
  const mainC = document.getElementById('main-container');
  if (mainC) {
    if (data) cardTemplate(mainC, data);
    else mainC.innerHTML = '<p>Failed to load products. Check the console for details.</p>';
  }
  updateCartCount();
  const c = document.getElementById('cli');
  if (c) c.addEventListener('click', () => displayCartItems());
}

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
    
    const base = import.meta.env.BASE_URL || '/';

    card.innerHTML =`
   

    <h3>${data.title}</h3>
    
    <img src="${data.image}" alt="${data.title}">

    <p> $${data.price}</p>
    <a class = 'links' href="${base}product-details/index.html?productId=${data.id}">More about prodocut</a>

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
export function addToCart(product) {
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
  const id = Number(productId);
  let cart = getCart();
  cart = cart.filter(item => Number(item.id) !== id);
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
        <td><button class="remove-btn" data-id="${item.id}">Remove</button></td>
      </tr>
    `;
  });

  html += '</table>';
  cartItemsDiv.innerHTML = html;

  // Wire remove buttons
  const removeButtons = cartItemsDiv.querySelectorAll('.remove-btn');
  removeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      removeFromCart(id);
    });
  });
}

// Update cart count in header
export function updateCartCount() {
  const cart = getCart();
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = `(${cart.length})`;
  }
}

// Cart button is wired in `init()` after header is loaded