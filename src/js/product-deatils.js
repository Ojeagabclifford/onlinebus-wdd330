import { loadHeaderFooter,getParams,fetchData  } from "./utils.mjs";

loadHeaderFooter();





const dataId = getParams('productId');

const dataDetails = await fetchData('https://fakestoreapi.com/products');
const main = document.getElementById('main-container');

dataDetails.forEach(data => {

    if(data.id == dataId)
    {
        

main.innerHTML= `
<div class= 'cards' >

        <h3>${data.title}</h3>
   
    <img src="${data.image}" alt="${data.title}">
     <p> $${data.price}</p>
    
            
    <p>${data. description}   
  `
    }
    
});






