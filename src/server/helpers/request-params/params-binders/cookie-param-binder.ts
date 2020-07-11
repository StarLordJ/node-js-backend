import { Request } from 'express';
import { IParamBinder } from './param-binder.interface';
import { IValueParser } from './types';

export class CookieParamBinder implements IParamBinder {
  private readonly name: string;
  private readonly valueParser: IValueParser;

  public constructor(name: string, valueParser: IValueParser) {
    this.name = name;
    this.valueParser = valueParser;
  }

  public extractValue(req: Request): { [key: string]: unknown } {
    return { [this.name]: this.valueParser(req.cookies[this.name]) };
  }
}