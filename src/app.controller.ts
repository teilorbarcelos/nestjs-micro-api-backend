import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Category } from './interfaces/categories/category.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @EventPattern('create-category')
  async createCategory(@Payload() category: Category) {
    this.logger.log(`category: ${JSON.stringify(category)}`);
    await this.appService.createCategory(category);
  }

  @MessagePattern('get-category')
  async getCategies(@Payload() categoryId: string) {
    if (categoryId) return this.appService.getCategoryById(categoryId);
    return this.appService.getCategories();
  }
}
