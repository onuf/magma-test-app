import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;
