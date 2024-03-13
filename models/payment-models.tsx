export interface PaymentInfoModel {
    details: {id: number,title: string,price: string}[],
    totalPrice: string,
    ads: {
        title: string,
        slug: string,
    },
    billingAddress: {
        id?: string;
        title?: string;
        city?: string;
        district?: string;
        address?: string;
    }
}

export interface AdvertPaymentForm {
    cardHolderName: string
    cardNumber: string,
    expireYear: string,
    expireMonth: string,
    cvc: string,
    title: string,
    city: string,
    district: string,
    address: string,
    name: string,
    surname: string,
}