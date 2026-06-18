import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HuariquesController } from './huariques.controller';
import { HuariquesService } from './huariques.service';
import { Huarique, HuariqueSchema } from './schemas/huarique.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Huarique.name, schema: HuariqueSchema }]),
    AuthModule,
  ],
  controllers: [HuariquesController],
  providers: [HuariquesService],
  exports: [HuariquesService],
})
export class HuariquesModule {}
