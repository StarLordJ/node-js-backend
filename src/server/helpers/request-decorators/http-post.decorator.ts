import { TDecoratorParams } from './decorator-param.type';
import { routesProperty } from './const/routes-property.const';
import { buildHandler } from './utils/build-handler';
import { Express } from 'express';

export function httpPost({
  urlPattern,
  resultHandler,
  middleWares = [],
  bodyParams = []
}: TDecoratorParams): MethodDecorator {
  return (instanceClass: any, propertyKey: string | symbol): void => {
    instanceClass[routesProperty] = instanceClass[routesProperty] || [];
    function setupBinding(instance: any, expressApp: Express): void {
      if (middleWares.length) {
        expressApp.post(
          urlPattern,
          ...middleWares,
          buildHandler(instance, propertyKey, bodyParams, resultHandler)
        );
      } else {
        expressApp.post(
          urlPattern,
          buildHandler(instance, propertyKey, bodyParams, resultHandler)
        );
      }
    }

    instanceClass[routesProperty].push(setupBinding);
  };
}
