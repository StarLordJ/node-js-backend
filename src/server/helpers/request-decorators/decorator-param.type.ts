import { IResultHandler } from '../response-params/response-handlers/result-handler.interface';
import { RequestHandler } from 'express-serve-static-core';
import { IParamBinder } from '../request-params/params-binders/param-binder.interface';

export type TDecoratorParams = {
  urlPattern: string | RegExp;
  resultHandler: IResultHandler;
  middleWares?: RequestHandler[];
  bodyParams?: IParamBinder[];
};
