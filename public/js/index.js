const socket = io();
const productsList = document.getElementById('productsList');
const addForm = document.getElementById('addForm');
const deleteForm = document.getElementById('deleteForm');

// AGREGAR PRODUCTO
addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const description = document.getElementById('description').value;

  await fetch('/realtimeproducts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, price, description }),
  });
  addForm.reset();
});

// ELIMINAR PRODUCTO
deleteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('id').value;
  await fetch('/realtimeproducts', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  deleteForm.reset();
});

//OBTENER PRODUCTOS
socket.on('products', (data) => {
  console.log(data);
  productsList.innerHTML = '';
  const divContainer = document.createElement('div');
  divContainer.classList.add('container');
  divContainer.classList.add('mt-5');

  const divRow = document.createElement('div');
  divRow.classList.add('row');
  divRow.classList.add('p-2');
  data.forEach((product) => {
    const divCol = document.createElement('div');
    divCol.classList.add('col-4');
    divCol.classList.add('p-2');

    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('border-light');
    card.innerHTML = `                
          <div class="card-body bg-dark text-white">
            <h5 class="card-title text-uppercase">${product.title}</h5>
            <p class="card-text">ID: ${product.pid}</p>
            <p class="card-text">${product.description}</p>
            <p class="card-text">$${product.price}</p>    
       
    `;
    divCol.appendChild(card);
    divRow.appendChild(divCol);
    divContainer.appendChild(divRow);
    productsList.appendChild(divContainer);
    //todos estos append para poder hacer una grid con columnas y filas
  });
});
