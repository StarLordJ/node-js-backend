import {
  CapsulesApiController,
  FaqsApiController,
  ReviewsApiController,
  ImagesApiController,
  CRMUsersApiController,
  AuthApiController,
  OrdersApiController,
  PaymentsApiController,
  ClientsApiController
} from '../server/controllers/api-controllers';
import { ExpressWrapper } from './../server/express-wrapper/express-wrapper';
import {
  CapsulesStorage,
  FaqsStorage,
  ReviewsStorage,
  ImagesStorage,
  CRMUsersStorage,
  AuthStorage,
  OrdersStorage,
  PaymentsStorage,
  ClientsStorage,
  StylistsStorage
} from './../server/storages';
import { MainDataBaseController } from '../server/controllers/storage-controllers';
import { StylistsApiController } from '../server/controllers/api-controllers/stylists-api.controller';

export function runServer(): void {
  const dataBaseController = new MainDataBaseController();

  const imageStorage = new ImagesStorage(dataBaseController);
  const capsulesStorage = new CapsulesStorage(dataBaseController);
  const faqsStorage = new FaqsStorage(dataBaseController);
  const reviewsStorage = new ReviewsStorage(dataBaseController);
  const crmUsersStorage = new CRMUsersStorage(dataBaseController);
  const authStorage = new AuthStorage(dataBaseController);
  const ordersStorage = new OrdersStorage(dataBaseController);
  const paymentsStorage = new PaymentsStorage(dataBaseController);
  const clientsStorage = new ClientsStorage(dataBaseController);
  const stylistsStorage = new StylistsStorage(dataBaseController);

  const imageController = new ImagesApiController(imageStorage);
  const capsuleApiController = new CapsulesApiController(
    capsulesStorage,
    imageStorage
  );
  const faqApiController = new FaqsApiController(faqsStorage);
  const reviewApiController = new ReviewsApiController(
    reviewsStorage,
    imageStorage
  );
  const manageUsersApiController = new CRMUsersApiController(crmUsersStorage);
  const authUserApiController = new AuthApiController(authStorage);
  const ordersApiController = new OrdersApiController(ordersStorage);
  const paymentsApiController = new PaymentsApiController(paymentsStorage);
  const clientsApiController = new ClientsApiController(clientsStorage);
  const stylistsApiController = new StylistsApiController(stylistsStorage);

  const server = new ExpressWrapper(Number(process.env.PORT) || 5000, [
    capsuleApiController,
    faqApiController,
    reviewApiController,
    imageController,
    manageUsersApiController,
    authUserApiController,
    ordersApiController,
    paymentsApiController,
    clientsApiController,
    stylistsApiController
  ]);
  server.start();
}
