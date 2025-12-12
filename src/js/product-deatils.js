import { loadHeaderFooter, getParams, fetchData, addToCart, updateCartCount } from "./utils.mjs";

async function initProductDetails() {
  await loadHeaderFooter();

  const dataId = getParams('productId');
  const dataDetails = await fetchData('https://fakestoreapi.com/products');
  const main = document.getElementById('main-container');

  if (!main) return;
  if (!dataDetails) {
    main.innerHTML = '<p>Failed to load product data. Check the console for details.</p>';
    return;
  }

  const product = dataDetails.find(d => String(d.id) === String(dataId));
  if (!product) {
    main.innerHTML = '<p>Product not found</p>';
    return;
  }

  main.innerHTML = `
    <div class='cards'>
      <h3>${product.title}</h3>
      <img src="${product.image}" alt="${product.title}">
      <p>$${product.price}</p>
      <p>${product.description}</p>
      <button class="buy-btn">Add To cart</button>
    </div>`;

  const buyBtn = main.querySelector('.buy-btn');
  if (buyBtn) {
    buyBtn.addEventListener('click', () => {
      addToCart(product);
      updateCartCount();
      alert(`${product.title} added to cart`);
    });
  }

}

document.addEventListener('DOMContentLoaded', initProductDetails);






