import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CombinedAuthGuard } from '../auth/guards/combined-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('products')
@UseGuards(CombinedAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Create a new product
   */
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Query('organizationId') organizationId: string,
  ): Promise<ProductResponseDto> {
    return this.productService.createProduct(createProductDto, organizationId);
  }

  /**
   * Get all products for an organization
   */
  @Get()
  async findAllProducts(
    @Query('organizationId') organizationId: string,
    @Query('category') category?: string,
  ): Promise<ProductResponseDto[]> {
    if (category) {
      return this.productService.findProductsByCategory(
        category,
        organizationId,
      );
    }
    return this.productService.findAllProducts(organizationId);
  }

  /**
   * Get a product by ID
   */
  @Get(':id')
  async findProductById(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string,
  ): Promise<ProductResponseDto> {
    return this.productService.findProductById(id, organizationId);
  }

  /**
   * Update a product by ID
   */
  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Query('organizationId') organizationId: string,
  ): Promise<ProductResponseDto> {
    return this.productService.updateProduct(
      id,
      updateProductDto,
      organizationId,
    );
  }

  /**
   * Delete a product by ID
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string,
  ): Promise<void> {
    return this.productService.deleteProduct(id, organizationId);
  }

  /**
   * Health check endpoint for testing
   */
  @Get('admin/test')
  @Public()
  async test(): Promise<{ message: string }> {
    return { message: 'Product controller is working' };
  }
}
