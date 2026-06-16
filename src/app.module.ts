import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HuariquesModule } from './huariques/huariques.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Se conecta a MongoDB Atlas mediante variable de entorno o usa una base de datos local como fallback
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/huariquemap',
    ),
    HuariquesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
