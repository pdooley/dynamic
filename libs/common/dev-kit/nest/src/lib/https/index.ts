import { NextFunction, Request, Response } from 'express';

export function forceHttps() {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.secure) {
      return response.redirect(`https://${request.headers.host + request.url}`);
    }

    next();
  };
}
