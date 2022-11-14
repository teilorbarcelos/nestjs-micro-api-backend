import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PlayersModule } from './players/players.module';
import { CategoriesModule } from './categories/categories.module';

const configService = new ConfigService();
const DB_URL = configService.get<string>('DB_URL');

@Module({
  imports: [
    MongooseModule.forRoot(DB_URL, {
      // useNewUrlParses: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
    }),
    CategoriesModule,
    PlayersModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
