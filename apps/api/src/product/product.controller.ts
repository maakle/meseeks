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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CombinedAuthGuard } from '../auth/guards/combined-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
@UseGuards(CombinedAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Query('organizationId') organizationId: string,
  ): Promise<ProductResponseDto> {
    return this.productService.createProduct(createProductDto, organizationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products for the organization' })
  @ApiResponse({
    status: 200,
    description: 'Return all products',
    type: [ProductResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
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

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the product',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async findProductById(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string,
  ): Promise<ProductResponseDto> {
    return this.productService.findProductById(id, organizationId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: 204,
    description: 'Product deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async deleteProduct(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string,
  ): Promise<void> {
    return this.productService.deleteProduct(id, organizationId);
  }
}
