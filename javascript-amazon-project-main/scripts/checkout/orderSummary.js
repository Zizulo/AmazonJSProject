import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from "./paymentSummary.js";
import { Carts } from "../../data/cart-class.js";

const cartsInstance = new Carts();
export function renderOrderSummary(){
    let cartSummaryHTML = '';

    cartsInstance.cartsItems.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    let dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
        <div class="cart-item-container js-cart-item-container
        js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
                Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${matchingProduct.image}">

                <div class="cart-item-details">
                <div class="product-name js-product-name-${matchingProduct.id}">
                    ${matchingProduct.name}
                </div>
                <div class="product-price js-product-price-${matchingProduct.id}">
                    ${matchingProduct.getPrice()}
                </div>
                <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                    <span>
                    Quantity: <span class="quantity-label js-quantity-opacity">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary" 
                    data-product-id="${matchingProduct.id}">
                    Update
                    </span>
                    <input class="quantity-input">
                    <span class="save-quantity-link link-primary">Save</span>
                    <span class="delete-quantity-link link-primary js-delete-link
                    js-delete-link-${matchingProduct.id}" 
                    data-product-id="${matchingProduct.id}">Delete</span>
                </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(matchingProduct, cartItem)}
                </div>
            </div>
        </div>
        `;
    });

    function deliveryOptionsHTML(matchingProduct, cartItem){
        let html = '';

        deliveryOptions.forEach((deliveryOption)=>{
            let dateString = calculateDeliveryDate(deliveryOption);

            const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html += `<div class="delivery-option js-delivery-option
            js-delivery-option-${matchingProduct.id}-${deliveryOption.id}" 
            data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
                        <input type="radio" ${isChecked ? 'checked' : ''}
                        class="delivery-option-input
                        js-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}"
                        name="delivery-option-${matchingProduct.id}">
                        <div>
                        <div class="delivery-option-date">
                            ${dateString}
                        </div>
                        <div class="delivery-option-price">
                            ${priceString} Shipping
                        </div>
                        </div>
                    </div>`
        });

        return html;
    }

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

    const quantity = cartsInstance.updateCartQuantity();
    document.querySelector('.js-checkout-quantity').innerHTML = `${quantity} items`;

    document.querySelectorAll('.js-delete-link').forEach(link => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            cartsInstance.removeFromCart(productId);

            renderOrderSummary();
            renderPaymentSummary();
        });
    });

    document.querySelectorAll('.update-quantity-link').forEach(link => {
        link.addEventListener('click', () => {
            const updateId = link.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${updateId}`);
            let quantityInput = container.querySelector('.quantity-input');
            let saveQuantityLink = container.querySelector('.save-quantity-link');
            let jsQuantityOpacity = container.querySelector('.js-quantity-opacity');

            quantityInput.value = jsQuantityOpacity.textContent;
            quantityInput.style.display = 'inline-block';
            saveQuantityLink.style.display = 'inline-block';
            jsQuantityOpacity.style.display = 'none';
            link.style.display = 'none';

            const saveQuantity = () => {
                let newValue = parseInt(quantityInput.value);
                console.log(newValue);

                if (isNaN(newValue) || newValue < 0 || newValue >= 1000) {
                    alert('Niepożądana wartość');
                    return;
                }

                quantityInput.style.display = 'none';
                saveQuantityLink.style.display = 'none';
                jsQuantityOpacity.style.display = 'inline-block';
                link.style.display = 'inline-block';

                cartsInstance.cartsItems.forEach(cartItem => {
                    const productId = cartItem.productId;

                    if (updateId === productId) {
                        cartsInstance.updateQuantity(productId, newValue); 
                    }
                });

                const quantity = cartsInstance.updateCartQuantity();
                document.querySelector('.js-checkout-quantity').innerHTML = `${quantity} items`;
                jsQuantityOpacity.textContent = newValue;
                renderPaymentSummary();
            };

            saveQuantityLink.addEventListener('click', saveQuantity, { once: true });

            quantityInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveQuantity();
                    renderPaymentSummary();
                }
            });
        });
    });

    document.querySelectorAll('.js-delivery-option').forEach((element)=>{
        element.addEventListener('click', ()=>{
            const {productId, deliveryOptionId} = element.dataset;
            cartsInstance.updateDeliveryOption(productId, deliveryOptionId); 
            renderOrderSummary();
            renderPaymentSummary(); 
        });
    });
}