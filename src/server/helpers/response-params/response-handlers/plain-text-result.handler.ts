import { Response } from 'express';
import { IResultHandler } from './result-handler.interface';

export class PlainTextResultHandler implements IResultHandler {
  public async processResult(
    result: string,
    req: Express.Request,
    res: Response
  ): Promise<void> {
    res.send(result.trim());
  }
}
