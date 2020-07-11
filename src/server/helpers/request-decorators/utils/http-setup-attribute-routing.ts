import { Express } from 'express';
import { routesProperty } from './../const/routes-property.const';

export function httpSetupAttributeRouting<T>(
  instance: T,
  expressApp: Express
): void {
  for (const route of instance[routesProperty] || []) {
    route(instance, expressApp);
  }
}
