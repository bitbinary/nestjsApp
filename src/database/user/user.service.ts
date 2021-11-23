import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserIdentifier } from '../../interfaces/User.interface';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUser(identifier: UserIdentifier) {
    return await this.userModel.findOne({ ...identifier });
  }

  async updateUserData(identifier, newDetails) {
    const user = await this.userModel.findOne({
      ...identifier,
    });
    user.set({ ...newDetails });
    return await user.save();
  }
}
