import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
// import '../data/cart-class.js';
// import '../data/backend-practice.js';

async function loadPage(){
    try{
        // throw 'error1';
        await loadProductsFetch();
        renderOrderSummary();
        renderPaymentSummary(); 
    } catch(error) {
        console.log('Unexpected error. Please try again later.'); 
    }
}
loadPage();

// new Promise((reject) => {
//     loadProductsFetch(() => {
//         reject('error3');
//     });
// }).then(() => {
//     renderOrderSummary();
//     renderPaymentSummary(); 
// });

// loadProducts(() => {
//     renderOrderSummary();
//     renderPaymentSummary(); 
// });
