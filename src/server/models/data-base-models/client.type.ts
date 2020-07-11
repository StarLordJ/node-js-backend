import { TCRMUserId } from "../../types";

export type TDataBaseClient = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  last_changed: TCRMUserId;
};
