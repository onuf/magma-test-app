import { Request, Response } from 'express';
import UserModel from '../models/user';

export const getAllUsers = async (request: Request, response: Response) => {
  const users = await UserModel.find({});
  response.send(users);
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
