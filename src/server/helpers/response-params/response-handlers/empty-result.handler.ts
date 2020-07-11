import { Response } from 'express';
import { IResultHandler } from './result-handler.interface';

export class EmptyResultHandler implements IResultHandler {
  public async processResult(
    result: unknown,
    req: Express.Request,
    res: Response
  ): Promise<void> {
    res.end();
  }
}
