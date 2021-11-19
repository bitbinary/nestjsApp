import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async findUser(identifier) {
    return await this.userModel.findOne({ ...identifier });
  }

  async updateUserData(identifier, newDetails) {
    const user = await this.userModel.findOne({
      ...identifier,
    });
    user.set({ ...newDetails });
    await user.save();
  }
}
