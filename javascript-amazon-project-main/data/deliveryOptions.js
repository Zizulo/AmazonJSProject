import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export const deliveryOptions = [{
    id: '1',
    deliveryDays: 7,
    priceCents: 0
}, {
    id: '2',
    deliveryDays: 3,
    priceCents: 499
}, {
    id: '3',
    deliveryDays: 1,
    priceCents: 999
}];

export function getDeliveryOption(deliveryOptionId){
    let deliveryOption;

    deliveryOptions.forEach((option)=>{
        if(option.id === deliveryOptionId){
            deliveryOption = option;
        }
    });

    return deliveryOption || deliveryOptions[0];
}

export function validDeliveryOption(deliveryOptionId){
    let found = false;

    deliveryOptions.forEach((option) => {
        if(option.id === deliveryOptionId){
            found = true;
        }
    });

    return found;
}

export function calculateDeliveryDate(deliveryOption){
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    let afterWeek;
    let dateStringDelivery;
    if(deliveryDate.format('dddd') === 'Saturday'){
        afterWeek = today.add(deliveryOption.deliveryDays + 2, 'days')
        dateStringDelivery = formatDeliveryDays(afterWeek);
    }
    else if(deliveryDate.format('dddd') === 'Sunday'){
        afterWeek = today.add(deliveryOption.deliveryDays + 1, 'days')
        dateStringDelivery = formatDeliveryDays(afterWeek);
    }else{
        dateStringDelivery = formatDeliveryDays(deliveryDate);
    }
    return dateStringDelivery;
}

function formatDeliveryDays(dateToEdit){
    const dateString = dateToEdit.format('dddd, MMMM D');
    return dateString;
}


