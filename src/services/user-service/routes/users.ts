/* eslint-disable @typescript-eslint/no-misused-promises */
// See: https://github.com/davidbanham/express-async-errors/issues/35

import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);

router.post('/', createUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

export default router;
