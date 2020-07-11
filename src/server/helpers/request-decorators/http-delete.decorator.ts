import { TDecoratorParams } from './decorator-param.type';
import { routesProperty } from './const/routes-property.const';
import { Express } from 'express';
import { buildHandler } from './utils/build-handler';

export function httpDelete({
  urlPattern,
  resultHandler,
  middleWares = [],
  bodyParams = []
}: TDecoratorParams): MethodDecorator {
  return (instanceClass: any, propertyKey: string | symbol): void => {
    instanceClass[routesProperty] = instanceClass[routesProperty] || [];

    function setupBinding(instance: any, expressApp: Express): void {
      if (middleWares.length) {
        expressApp.delete(
          urlPattern,
          ...middleWares,
          buildHandler(instance, propertyKey, bodyParams, resultHandler)
        );
      } else {
        expressApp.delete(
          urlPattern,
          buildHandler(instance, propertyKey, bodyParams, resultHandler)
        );
      }
    }

    instanceClass[routesProperty].push(setupBinding);
  };
}
