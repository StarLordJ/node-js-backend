import { TFromServerFaq } from '../server-models';

export type TLandingFaq = Omit<TFromServerFaq, 'is_displaying' | 'id'>;
