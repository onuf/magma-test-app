import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { transformToJson } from '../util/helpers';

interface User extends mongoose.Document {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    transformToJson(returnedObject);
  },
});

const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;
