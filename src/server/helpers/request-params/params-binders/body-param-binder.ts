import { Request } from 'express';
import { IParamBinder } from './param-binder.interface';
import { IValueParser } from './types';

export class BodyParamBinder implements IParamBinder {
  public constructor(private name: string, private valueParser: IValueParser) {
    this.name = name;
    this.valueParser = valueParser;
  }

  public extractValue(req: Request): { [key: string]: unknown } {
    return {
      [this.name]: this.valueParser(
        this.name === 'blob' ? req.file : req.body[this.name]
      )
    };
  }
}
