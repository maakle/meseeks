import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CombinedAuthGuard } from '../auth/guards/combined-auth.guard';
import { UploadFilesResponseDto } from '../common/dto/upload-files.dto';
import { FileUploadInterceptor } from '../common/interceptors/file-upload.interceptor';
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

  @Post(':id/files')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  @UseInterceptors(FileUploadInterceptor)
  @ApiOperation({ summary: 'Upload files for a product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Files to upload',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Files to upload (max 10 files, 10MB each)',
        },
        altTexts: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Alt text for each file (optional)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
    type: UploadFilesResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file type or size',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async uploadProductFiles(
    @Param('id') productId: string,
    @Query('organizationId') organizationId: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({
            fileType: '.(jpg|jpeg|png|webp|gif|pdf|txt)',
          }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Body('altTexts') altTexts?: string[],
  ): Promise<UploadFilesResponseDto> {
    const uploadedFiles = await this.productService.uploadProductFiles(
      productId,
      organizationId,
      files,
      altTexts,
    );

    return {
      files: uploadedFiles,
      totalFiles: uploadedFiles.length,
    };
  }

  @Delete(':productId/files/:fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a file from a product' })
  @ApiResponse({
    status: 204,
    description: 'File deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Product or file not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  async deleteProductFile(
    @Param('productId') productId: string,
    @Param('fileId') fileId: string,
    @Query('organizationId') organizationId: string,
  ): Promise<void> {
    return this.productService.deleteProductFile(
      productId,
      organizationId,
      fileId,
    );
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
