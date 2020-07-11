import {
  EmptyResultHandler,
  JsonResultHandler,
  PlainTextResultHandler,
  AuthJWTSetHandler
} from './response-handlers';

export const httpReturn = {
  Void: new EmptyResultHandler(),
  Json: new JsonResultHandler(),
  PlainText: new PlainTextResultHandler(),
  SetCookieJson: new AuthJWTSetHandler()
};
