import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { Category } from './interfaces/categories/category.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @EventPattern('create-category')
  async createCategory(@Payload() category: Category, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    this.logger.log(`category: ${JSON.stringify(category)}`);

    try {
      await this.appService.createCategory(category);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}'`);
      // ackErrors.map(async (ackErrors) => {
      //   if (error.message.includes(ackErrors)) {
      //     await channel.ack(originalMessage);
      //   }
      // });

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) await channel.ack(originalMessage);
    }
  }

  @MessagePattern('get-category')
  async getCategies(@Payload() categoryId: string) {
    if (categoryId) return this.appService.getCategoryById(categoryId);
    return this.appService.getCategories();
  }
}
