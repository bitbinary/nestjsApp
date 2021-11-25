import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserIdentifier } from '../../interfaces/User.interface';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Funtion to find the user based on an identifiable value or combination of values
  async findUser(identifier: UserIdentifier) {
    return await this.userModel.findOne({ ...identifier });
  }

  // Funtion to update the user based on an identifiable value or combination of values, and the update values
  async updateUserData(identifier, newDetails) {
    //  Identifies the user
    const user = await this.userModel.findOne({
      ...identifier,
    });
    // add the updates
    user.set({ ...newDetails });
    // Commits the changes
    return await user.save();
  }
}
