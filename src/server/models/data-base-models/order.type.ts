import { TCRMUserId } from "../../types";

export enum OrderStatus {
    PAYED = 'оплачен',
    PARTIALY_PAYED = 'частично оплачен',
    NOT_PAYED = 'не оплачен'
}

export type TDataBaseOrder = {
    id: number;
    status: string;
    service_type: string;
    date_of_service: Date;
    client: number;
    stylist: number;
    payment_state: OrderStatus;
    last_changed: TCRMUserId;
}