import { Request, Response } from 'express';
import UserModel from '../models/user';
import { UserEventProducer } from '../events/notification-producer';
import { USER_EVENTS } from '../../../util/types';
import config from '../../../util/config';
import { transformToJson } from '../util/helpers';
import { isString } from '../util/validators';


const eventProducer = new UserEventProducer(config.rabbitMQ);

export const getAllUsers = async (request: Request, response: Response) => {
  const page = isString(request.query.page) ? (parseInt(request.query.page) || 1) : 1;
  const limit = isString(request.query.limit) ? (parseInt(request.query.limit) || 5) : 5;

  // const users = await UserModel.find({}).skip((page - 1) * limit).limit(limit);
  // return users;
  const result = await UserModel.aggregate([
    {
      $facet: {
        metadata: [
          { $count: 'totalDocuments' },
          { $addFields: {
            totalPages: { $ceil: { $divide: ['$totalDocuments', limit] } },
            pageNumber: page,
          } },
        ],
        data: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ],
      },
    }
  ]);

  const users = result[0] as Record<string, unknown>;

  users.metadata = {
    ...(<Array<object>>users.metadata)[0],
    pageItemCount: (<Array<Record<string, unknown>>>users.data).length,
  };

  if (Array.isArray(users.data)) {
    users.data = (<Array<Record<string, unknown>>>users.data).map((user) => transformToJson(user));
  }

  return response.send(users);
};

export const getUserById = async (request: Request, response: Response) => {
  const user = await UserModel.findById(request.params.id);
  if (user)
    response.json(user);
  else
    response.status(404).end();
};

export const createUser = async (request: Request, response: Response) => {
  const { name, email } = request.body as Record<string, string>;
  const user = new UserModel({ name, email });
  const savedUser = await user.save();
  await eventProducer.publishEvent({
    type: USER_EVENTS.CREATION,
    data: {
      name,
      email,
      id: savedUser.id as string,
    },
  });
  response.status(201).json(savedUser);
};

export const updateUser = async (request: Request, response: Response) => {
  const { name, email } = request.body as Record<string, string>;
  const user = await UserModel.findByIdAndUpdate(
    request.params.id,
    { name, email },
    { new: true },
  );
  response.json(user);
};

export const deleteUser = async (request: Request, response: Response) => {
  const user = await UserModel.findById(request.params.id);
  if (user) {
    await user.deleteOne();
    await eventProducer.publishEvent({
      type: USER_EVENTS.DELETION,
      data: {
        name: user.name,
        email: user.email,
        id: user.id as string,
      },
    });
  }
  response.status(204).end();
};
