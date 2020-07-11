import { Request } from 'express';

export interface IParamBinder {
  extractValue(req: Request): { [key: string]: unknown };
}
