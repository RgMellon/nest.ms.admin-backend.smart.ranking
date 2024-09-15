import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { CategoriesModule } from './categories/categories.module';

const connectionMoongoose =
  'mongodb+srv://rgmelo94:qDcOSHhQrrtSdO6e@cluster0.q9qgq6n.mongodb.net/sradmbackend?retryWrites=true&w=majority&appName=Cluster0';

@Module({
  imports: [
    MongooseModule.forRoot(connectionMoongoose),
    PlayersModule,
    CategoriesModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
