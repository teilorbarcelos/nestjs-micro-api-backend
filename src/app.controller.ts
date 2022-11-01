import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { error } from 'console';
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
    ackErrors.map(ackErrors => {
      if(error.message.includes(ackErrors)) {
        await channel.ack(originalMessage)
      }
    })

    try {
      await this.appService.createCategory(category);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)`)
    }
  }

  @MessagePattern('get-category')
  async getCategies(@Payload() categoryId: string) {
    if (categoryId) return this.appService.getCategoryById(categoryId);
    return this.appService.getCategories();
  }
}
