import { IValueParser } from './params-binders/types';
import { IParamBinder } from './params-binders/param-binder.interface';
import { BodyParamBinder } from './params-binders/body-param-binder';
import { QueryUrlParamBinder } from './params-binders/query-url-param-binder';
import { HeaderParamBinder } from './params-binders/header-param-binder';
import { CookieParamBinder } from './params-binders/cookie-param-binder';

export function httpBodyParam(
  urlParamName: string | 'blob' = 'blob',
  valueParser: IValueParser
): IParamBinder {
  return new BodyParamBinder(urlParamName, valueParser);
}

export function httpQueryUrlParam(
  urlParamName: string,
  valueParser: IValueParser
): IParamBinder {
  return new QueryUrlParamBinder(urlParamName, valueParser);
}

export function httpHeaderParam(
  paramName: string,
  valueParser: IValueParser
): IParamBinder {
  return new HeaderParamBinder(paramName, valueParser);
}

export function httpCookieParam(paramName: string, valueParser: IValueParser): IParamBinder {
  return new CookieParamBinder(paramName, valueParser);
}
