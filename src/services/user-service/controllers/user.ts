import { Request, Response } from 'express';
import UserModel from '../models/user';
import { transformToJson } from '../util/helpers';
import { isString } from '../util/validators';

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
  }
  response.status(204).end();
};
