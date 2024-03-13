export interface RegisterFormModel {
    email: string,
    phone: string,
    fullname: string,
    password: string,
    password_confirmation: string,
    type: "corporate" | "personal",
    iaa: boolean,
    land_phone: string,
    activity_area: "real_estate" | "automobile",
    business_type: "person" | "limited" | "Incorporated ",
    tax_administration_city: string,
    tax_administration: string,
    tax_identity_number: string,
    identity_number: string,
    caa: boolean,
}

export interface LoginFormModel {
    email: string,
    password: string
}

export interface UserModel {
    fullname: string;
    email: string;
    phone: string;
    advert_phone?: string;
    whatsapp?: string;
    type: "corporate" | "personal" | "advisor";
    is_active: boolean;
    email_verified: boolean;
    phone_verified: boolean;
    token?:string;
    image?: {small: string,medium: string}
}

export interface CorporateModel {
    id: string;
    company: string;
    image?: {small: string,medium: string},
    phone: string;
    whatsapp: string;
}
