import {
  FileStorageService,
  FileUploadResult,
} from '@/common/services/file-storage.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  /**
   * Create a new product for an organization
   */
  async createProduct(
    createProductDto: CreateProductDto,
    organizationId: string,
  ): Promise<ProductResponseDto> {
    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        organizationId,
      },
      include: {
        images: true,
      },
    });

    return this.mapToResponseDto(product);
  }

  /**
   * Upload files for a product
   */
  async uploadProductFiles(
    productId: string,
    organizationId: string,
    files: Express.Multer.File[],
    altTexts?: string[],
  ): Promise<FileUploadResult[]> {
    // Verify product exists and belongs to organization
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        organizationId,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const uploadedFiles: FileUploadResult[] = [];

    // Upload each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const altText = altTexts?.[i];

      const uploadResult = await this.fileStorageService.uploadFile(
        file,
        'Product',
        productId,
        altText,
      );

      // Save file metadata to database
      const savedFile = await this.prisma.file.create({
        data: {
          id: uploadResult.id,
          name: uploadResult.name,
          key: uploadResult.key,
          width: uploadResult.width,
          height: uploadResult.height,
          mimeType: uploadResult.mimeType,
          size: uploadResult.size,
          altText: uploadResult.altText,
          entityType: 'Product',
          entityId: productId,
        },
      });

      uploadedFiles.push({
        ...uploadResult,
        id: savedFile.id,
      });
    }

    return uploadedFiles;
  }

  /**
   * Delete a file from a product
   */
  async deleteProductFile(
    productId: string,
    organizationId: string,
    fileId: string,
  ): Promise<void> {
    // Verify product exists and belongs to organization
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        organizationId,
      },
      include: {
        images: {
          where: {
            id: fileId,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (product.images.length === 0) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    const file = product.images[0];

    // Delete from MinIO/S3
    await this.fileStorageService.deleteFile(file.key);

    // Delete from database
    await this.prisma.file.delete({
      where: {
        id: fileId,
      },
    });
  }

  /**
   * Get all products for an organization
   */
  async findAllProducts(organizationId: string): Promise<ProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      where: {
        organizationId,
      },
      include: {
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products.map((product) => this.mapToResponseDto(product));
  }

  /**
   * Get a product by ID within an organization
   */
  async findProductById(
    productId: string,
    organizationId: string,
  ): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        organizationId,
      },
      include: {
        images: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return this.mapToResponseDto(product);
  }

  /**
   * Update a product by ID within an organization
   */
  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto,
    organizationId: string,
  ): Promise<ProductResponseDto> {
    // Check if product exists and belongs to organization
    await this.findProductById(productId, organizationId);

    const updatedProduct = await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: updateProductDto,
      include: {
        images: true,
      },
    });

    return this.mapToResponseDto(updatedProduct);
  }

  /**
   * Delete a product by ID within an organization
   */
  async deleteProduct(
    productId: string,
    organizationId: string,
  ): Promise<void> {
    // Check if product exists and belongs to organization
    const product = await this.findProductById(productId, organizationId);

    // Delete all associated files from MinIO/S3
    if (product.images) {
      for (const image of product.images) {
        await this.fileStorageService.deleteFile(image.key);
      }
    }

    // Delete product (files will be deleted via cascade)
    await this.prisma.product.delete({
      where: {
        id: productId,
      },
    });
  }

  /**
   * Get products by category within an organization
   */
  async findProductsByCategory(
    category: string,
    organizationId: string,
  ): Promise<ProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      where: {
        category,
        organizationId,
      },
      include: {
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products.map((product) => this.mapToResponseDto(product));
  }

  /**
   * Map Prisma product to response DTO
   */
  private mapToResponseDto(product: any): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      organizationId: product.organizationId,
      images: product.images?.map((image: any) => ({
        id: image.id,
        name: image.name,
        key: image.key,
        url: image.key, // Will be replaced with presigned URL when needed
        width: image.width,
        height: image.height,
        mimeType: image.mimeType,
        size: image.size,
        altText: image.altText,
      })),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
