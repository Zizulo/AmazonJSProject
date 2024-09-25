import {validDeliveryOption} from './deliveryOptions.js';

function Carts(localStorageKey){
    const carts = {
        cartsItems: undefined,
        loadFromStorage(){
            this.cartsItems = JSON.parse(localStorage.getItem(localStorageKey));
    
            if(!this.cartsItems){
                this.cartsItems = [{
                    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                    quantity: 2,
                    deliveryOptionId: '1'
                }, {
                    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                    quantity: 1,
                    deliveryOptionId: '2'
                }];
            }
        },
        saveToStorage(){
            localStorage.setItem(localStorageKey, JSON.stringify(this.cartsItems));
        },  
        addToCart(productId, quantity){
            let matchingItem;
          
            this.cartsItems.forEach((cartItem) => {
              if(productId === cartItem.productId){
                matchingItem = cartItem;
              }
            });
          
            if(matchingItem){
              matchingItem.quantity = quantity;
            }else{
              this.cartsItems.push({
                productId: productId,
                quantity: quantity,
                deliveryOptionId: '1'
              });
            }
          
            this.saveToStorage();
        },
        removeFromCart(productId){
            const newCart = [];
            this.cartsItems.forEach(cartItem => {
              if(cartItem.productId !== productId){
                newCart.push(cartItem);
              }
            });
          
            this.cartsItems = newCart;
          
            this.saveToStorage();
        },
        updateCartQuantity(){
            let cartQuantity = 0;
            this.cartsItems.forEach(cartItem => {
                cartQuantity += cartItem.quantity;
            });
          
            return cartQuantity;
        },  
        updateQuantity(productId, newQuantity){
            this.cartsItems.forEach(cartItem => {
              if(productId === cartItem.productId) cartItem.quantity = newQuantity;
              this.saveToStorage();
            })
        },  
        updateDeliveryOption(productId, deliveryOptionId){
            let matchingItem;
          
            this.cartsItems.forEach((cartItem) => {
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
            this.saveToStorage();
        }
    };

    return carts;
}

const carts = Carts('carts-oop');
const businessCarts = Carts('carts-business'); 

carts.loadFromStorage();
businessCarts.loadFromStorage();

console.log(carts);
console.log(businessCarts);








