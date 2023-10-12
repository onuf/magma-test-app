import { ObjectId } from 'mongoose';


export function transformToJson(object: Record<string, unknown>): Record<string, unknown> {
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  object.id = (object._id as ObjectId).toString();
  delete object._id;
  delete object.__v;
  return object;
}