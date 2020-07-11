import { IResultHandler } from './result-handler.interface';
import { Response } from 'express';

export class JsonResultHandler implements IResultHandler {
  public async processResult(
    result: unknown,
    req: Express.Request,
    res: Response
  ): Promise<void> {
    res.json(result);
  }
}
