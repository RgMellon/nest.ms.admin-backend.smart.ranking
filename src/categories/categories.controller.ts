import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Category } from 'src/interfaces/categories/category.interface';
import { CategoriesService } from './categories.service';

import { codeErrors } from 'src/error/codeErrors';

@Controller()
export class CategoriesController {
  logger = new Logger();

  constructor(private readonly categoryService: CategoriesService) {}
  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const orignalMessage = context.getMessage();

    try {
      await this.categoryService.create(category);
      await channel.ack(orignalMessage);
      this.logger.log(`Category ${JSON.stringify(category)} created.`);
    } catch (err) {
      this.logger.error(`Error creating category: ${err.message}`);

      codeErrors.map(async (codeError) => {
        if (err.message.includes(codeError)) {
          await channel.ack(orignalMessage);
          this.logger.log(`Category ${JSON.stringify(category)} not created.`);
          throw new Error(`Category ${JSON.stringify(category)} not created.`);
        }
      });
    }
  }

  @MessagePattern('get-categories')
  async getAllCategories(
    @Payload() id: string,
  ): Promise<Category[] | Category> {
    if (!!id) {
      return await this.categoryService.findById(id);
    }

    return await this.categoryService.getAll();
  }

  @EventPattern('update-category')
  async updateCategory(@Payload() body: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const orignalMessage = context.getMessage();

    if (!body) {
      throw new Error('Invalid category provided.');
    }

    try {
      await this.categoryService.update(body.category, body.id);

      await channel.ack(orignalMessage);
    } catch (err) {
      codeErrors.map(async (codeError) => {
        if (err.message.includes(codeError)) {
          await channel.ack(orignalMessage);
          this.logger.log(
            `Category ${JSON.stringify(body.category)} not updated.`,
          );
          throw new Error(`Category ${body.id} not updated.`);
        }
      });

      await channel.ack(orignalMessage);
    }
  }
}
