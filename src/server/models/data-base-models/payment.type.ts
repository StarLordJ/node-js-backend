import { TCRMUserId } from "../../types";

export type TDataBasePayment = {
    id: number;
    date: Date;
    method: string;
    order_id: number;
    last_changed: TCRMUserId;
}