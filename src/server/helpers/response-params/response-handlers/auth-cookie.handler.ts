import { IResultHandler } from './result-handler.interface';
import { Response } from 'express';
import { TSafeUserData } from '../../../controllers/storage-controllers/auth-users-database.controller';

export type TJWTResult = { status: 'ok', token: string, user: TSafeUserData | null } | { status: 'error', message: string }

export class AuthJWTSetHandler implements IResultHandler {
  public async processResult(
    result: TJWTResult,
    req: Express.Request,
    res: Response
  ): Promise<void> {
      if (result.status === 'ok') {
          if (result.token.length) {
            res.cookie('jwt', result.token, { maxAge: 9999999999, httpOnly: true })
          } else {
              res.clearCookie('jwt');
          }
        
        res.json({ status: 'ok', user: result.user });
        return;
      }
      
      res.json(result);
  }
}
