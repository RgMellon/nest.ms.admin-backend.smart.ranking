import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from 'src/interfaces/players/player.interface';

@Injectable()
export class PlayersService {
  logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createPlayer(payload: Player): Promise<void> {
    try {
      this.logger.log(`payload ${JSON.stringify(payload)}}`);

      const newPlayer = new this.playerModel(payload);
      await newPlayer.save();
    } catch (err) {
      this.logger.log(`payload ${JSON.stringify(payload)}}`);
      throw new RpcException(err.message);
    }
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  public async update(payload: Player, id: string): Promise<Player> {
    return await this.playerModel
      .findByIdAndUpdate({ _id: id }, { $set: payload })
      .exec();
  }

  async getPlayerById(id: string): Promise<Player> {
    const foundPlayer = await this.playerModel.findOne({ _id: id }).exec();

    if (!foundPlayer) {
      throw new RpcException(`Player with id ${id} not found.`);
    }

    return foundPlayer;
  }

  async deletePlayer(id: string): Promise<Player> {
    return await this.playerModel.findByIdAndDelete({ _id: id }).exec();
  }
}
