'use strict';
const db = new Dexie('ShoppingApp');
db.version(1).stores({ items: '++id,name,price,isPurchased' });

const itemForm = document.getElementById('item-form');
const itemsDiv = document.getElementById('items-div');
const totalPriceDiv = document.getElementById('total-price-div');

const populateItemsDiv = async () => {
  const allItems = await db.items.reverse().toArray();
  itemsDiv.innerHTML = allItems
    .map(
      item => `
    <div class="item ${item.isPurchased && 'purchased'}">
    <label>
      <input 
      type="checkbox" 
      class="checkbox" 
      onchange="toggleItemStatus(event, ${item.id})"
      ${item.isPurchased && 'checked'}/>
    </label>

    <div class="item-info">
      <p>${item.name}</p>
      <p>$${item.price} x ${item.quantity}</p>
    </div>

    <button class="delete-button">X</button>
  </div>
  `
    )
    .join('');
  const arrayOfPrices = allItems.map(item => item.price * item.quantity);
  const totalPrice = arrayOfPrices.reduce((a, b) => a + b, 0);
  totalPriceDiv.innerText = 'Total price: $' + totalPrice;
};

window.onload = populateItemsDiv;

itemForm.onsubmit = async event => {
  event.preventDefault();

  const name = document.getElementById('name-input').value;
  const quantity = document.getElementById('quantity-input').value;
  const price = document.getElementById('price-input').value;

  await db.items.add({ name, quantity, price });
  await populateItemsDiv();

  itemForm.reset();
};

const toggleItemStatus = async (event, id) => {
  await db.items.update(id, { isPurchased: !!event.target.checked });
  await populateItemsDiv();
};
