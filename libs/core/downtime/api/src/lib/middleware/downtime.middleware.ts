// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';

// import { DowntimeService } from '../services';

// @Injectable()
// export class DowntimeMiddleware implements NestMiddleware {
//   constructor(private downtimeSvc: DowntimeService) {}
//   //TODO: change to guard
//   async use(req: Request, res: Response, next: NextFunction) {
//     const downtime = await this.downtimeSvc.getDowntimeStatus();
//     if (downtime) res.status(503).send({ message: 'servers are under maintenance', downtime });
//     else next();
//   }
// }
