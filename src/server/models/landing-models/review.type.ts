import { TFromServerReview } from './../server-models';

export type TLandingReview = Omit<TFromServerReview, 'is_displaying' | 'id'>;
