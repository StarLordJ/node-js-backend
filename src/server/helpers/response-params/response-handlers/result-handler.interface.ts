import { Request, Response } from 'express';

export interface IResultHandler {
  processResult(result: unknown, req: Request, res: Response): Promise<void>;
}
