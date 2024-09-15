import { Body, Controller, Logger, Param } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Player } from 'src/interfaces/players/player.interface';
import { PlayersService } from './players.service';
import { PlayerValidationParamsPipe } from './player.validation.params.pipe';
import { codeErrors } from 'src/error/codeErrors';

@Controller('players')
export class PlayersController {
  logger = new Logger(PlayersController.name);

  constructor(private readonly playerService: PlayersService) {}
  @EventPattern('create-player')
  async createPlayer(@Payload() body: Player, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const orignalMessage = context.getMessage();
    try {
      this.playerService.createPlayer(body);
      await channel.ack(orignalMessage);
    } catch (err) {
      this.logger.error(`Error creating Player: ${err.message}`);

      codeErrors.map(async (codeError) => {
        if (err.message.includes(codeError)) {
          await channel.ack(orignalMessage);
          this.logger.log(`Player ${JSON.stringify(body)} not created.`);
          throw new Error(`Player ${JSON.stringify(body)} not created.`);
        }
      });
    }
  }

  @MessagePattern('get-players')
  async getAllPlayers(@Ctx() context: RmqContext): Promise<Player[] | Player> {
    const channel = context.getChannelRef();
    const orignalMessage = context.getMessage();

    try {
      console.log('entri aqui?');
      await channel.ack(orignalMessage);
      return await this.playerService.getAllPlayers();
    } catch (err) {
      codeErrors.map(async (codeError) => {
        if (err.message.includes(codeError)) {
          await channel.ack(orignalMessage);
          this.logger.log(`error to get players`);
          throw new Error(`error to get players`);
        }
      });
    }
  }

  @MessagePattern('update-player')
  async updatePlayer(
    @Body() body: Player,
    @Param('_id', PlayerValidationParamsPipe) _id: string,
  ): Promise<Player[] | Player> {
    return await this.playerService.update(body, _id);
  }

  @MessagePattern('delete-player')
  async deletePlayer(
    @Param('_id', PlayerValidationParamsPipe) _id: string,
  ): Promise<Player[] | Player> {
    return await this.playerService.deletePlayer(_id);
  }
}
