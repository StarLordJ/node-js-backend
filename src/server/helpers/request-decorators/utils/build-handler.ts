import { IParamBinder } from '../../request-params/params-binders/param-binder.interface';

import { IResultHandler } from '../../response-params/response-handlers/result-handler.interface';
import { Request, Response } from 'express';

export type RequestHandler = (req: Request, res: Response) => Promise<void>;

export function buildHandler(
  instance: any,
  methodName: string | symbol,
  paramConfigs: IParamBinder[],
  resultHandler: IResultHandler
): RequestHandler {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const params = paramConfigs
        .map((x): unknown => x.extractValue(req))
        .reduce((acc, val) => (acc = { ...acc, ...val }), {});
      let result = instance[methodName].call(instance, params);

      if (typeof result.then === 'function') {
        result = await result;
      }
      await resultHandler.processResult(result, req, res);
    } catch (e) {
      if (e instanceof Error) {
        res.status(500).send(`${e.message}\n${e.stack}`);
      } else {
        res.status(500).send(`${e}`);
      }
      return;
    }
  };
}
