import { Request, Response, RequestHandler } from 'express-serve-static-core';
import { AuthUsersDatabaseController } from './../../storage-controllers';
import jwtTool from 'jsonwebtoken';
import { NextFunction } from 'express';

export function getAuthCheckHandler(): RequestHandler {
  return authCheckHandler;
}

async function authCheckHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const jwt = req.cookies['jwt'];

  if (jwt) {
    const result = await AuthUsersDatabaseController.instance.checkIfUserAuthorised(
      jwt
    );

    if (result.status === 'ok') {
      req.body.user = jwtTool.decode(jwt);
      next();
      return;
    }
  }
  res.status(403).send({ error: 'Вы не авторизованы' });
}
