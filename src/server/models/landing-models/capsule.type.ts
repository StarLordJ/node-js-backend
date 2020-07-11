import { TFromServerCapsule } from '../server-models';

export type TLandingCapsule = Omit<TFromServerCapsule, 'is_displaying' | 'id'>;
