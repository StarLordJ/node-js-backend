import { TDataBaseStylist } from "../data-base-models";

export type TFromServerStylist = Omit<TDataBaseStylist, 'password' | 'last_changed'>;