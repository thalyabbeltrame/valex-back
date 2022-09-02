import { NextFunction, Request, Response } from 'express';

export function erroHandler(
  error: { status: string; message: string },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error.status === 'bad_request') {
    return res.status(400).send(error.message);
  }
  if (error.status === 'unauthorized') {
    return res.status(401).send(error.message);
  }
  if (error.status === 'forbidden') {
    return res.status(403).send(error.message);
  }
  if (error.status === 'not_found') {
    return res.status(404).send(error.message);
  }
  if (error.status === 'conflict') {
    return res.status(409).send(error.message);
  }
  if (error.status === 'unprocessable_entity') {
    return res.status(422).send(error.message);
  }
  return res.status(500).send(error.message);
}
