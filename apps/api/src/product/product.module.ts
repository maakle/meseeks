import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
