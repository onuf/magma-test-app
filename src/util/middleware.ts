import { RequestHandler, ErrorRequestHandler } from 'express';
import logger from './logger';

export const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message as string });
  } else if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } 

  next(error);
};

export const unknownEndpoint: RequestHandler = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
