import { TDataBaseFaq } from './../data-base-models/faq.type';

export type TFromServerFaq = Omit<TDataBaseFaq, 'last_changed'>;
