import {validDeliveryOption} from './deliveryOptions.js';

export let carts;

loadFromStorage();

export function loadFromStorage(){
  if(!carts){
    carts = [{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1'
    }, {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2'
    }];
  }
}

function saveToStorage(){
  localStorage.setItem('carts', JSON.stringify(carts));
}

export function addToCart(productId, quantity){
  let matchingItem;

  carts.forEach((cartItem) => {
    if(productId === cartItem.productId){
      matchingItem = cartItem;
    }
  });

  if(matchingItem){
    matchingItem.quantity = quantity;
  }else{
    carts.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();
}

export function removeFromCart(productId){
  const newCart = [];
  carts.forEach(cartItem => {
    if(cartItem.productId !== productId){
      newCart.push(cartItem);
    }
  });

  carts = newCart;

  saveToStorage();
}

export function updateCartQuantity(){
  let cartQuantity = 0;
  carts.forEach(cartItem => {
      cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

export function updateQuantity(productId, newQuantity){
  carts.forEach(cartItem => {
    if(productId === cartItem.productId) cartItem.quantity = newQuantity;
    saveToStorage();
  })
}

export function updateDeliveryOption(productId, deliveryOptionId){
  let matchingItem;

  carts.forEach((cartItem) => {
    if(productId === cartItem.productId){
      matchingItem = cartItem;
    }
  });

  if(!matchingItem){
    return;
  }

  if(!validDeliveryOption(deliveryOptionId)){
    return;
  }
  
  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}