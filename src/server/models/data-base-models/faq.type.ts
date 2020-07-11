import { TCRMUserId } from "../../types";

export type TDataBaseFaq = {
  id: number;
  is_displaying: boolean;
  view_order: number;
  question: string;
  answer: string;
  last_changed: TCRMUserId;
};
