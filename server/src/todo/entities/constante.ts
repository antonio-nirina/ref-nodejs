import { Request } from 'express';
import { TodoInterface } from './todo';


export const RequestError = 'Bad request.';

export interface IRequest extends Request {
    body: {
        todo: TodoInterface
    }
}
  