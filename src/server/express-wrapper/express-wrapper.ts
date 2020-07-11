import bodyParser from 'body-parser';
import cookies from 'cookie-parser';
import express, { Express } from 'express';
import { Server } from 'http';
import { httpSetupAttributeRouting } from '../helpers/request-decorators';

export class ExpressWrapper {
  private expressApplication: Express;
  private port: number;
  private serverInstance?: Server;
  private apiControllers: Array<any>;

  public constructor(port: number, apiControllers: Array<any>) {
    this.port = port;
    this.expressApplication = express();
    this.expressApplication.use(
      bodyParser.json({
        type: ['application/json', 'text/plain']
      }),
      cookies()
    );
    this.apiControllers = apiControllers;
  }

  public async start(): Promise<void> {
    this.apiControllers.forEach(controller =>
      httpSetupAttributeRouting(controller, this.expressApplication)
    );

    for (const controller of this.apiControllers) {
      controller.setupMiddleware && (await controller.setupMiddleware(this.expressApplication));
    }

    this.serverInstance = await this.startExpressApplication();

    console.log(`Server side listening on port ${this.port}!`);
  }

  public async stop(): Promise<void> {
    if (this.serverInstance !== undefined) {
      this.serverInstance.close();
    }
  }

  private async startExpressApplication(): Promise<Server> {
    return new Promise<Server>((resolve): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-function-return-type
      const result = this.expressApplication.listen(this.port, async () =>
        setTimeout(() => resolve(result), 1)
      );
    });
  }
}
