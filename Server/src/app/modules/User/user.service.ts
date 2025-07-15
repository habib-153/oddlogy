import { QueryBuilder } from '../../builder/QueryBuilder';
import { UserSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder(User.find(), query)
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(UserSearchableFields);

  const result = await users.modelQuery;
  const meta = await users.countTotal();

  return { result, meta };
};

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id)

  return user;
};

const updateUserIntoDB = async (payload: Partial<TUser>, id: string) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });

  console.log('result', result);
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndDelete(id);

  return result;
};

export const UserServices = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
};
