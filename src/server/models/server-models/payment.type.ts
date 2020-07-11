import { TDataBasePayment } from "../data-base-models";

export type TFromServerPayment = Omit<TDataBasePayment, 'last_changed'>;