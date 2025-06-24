import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

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
    });

    return this.mapToResponseDto(product);
  }

  /**
   * Get all products for an organization
   */
  async findAllProducts(organizationId: string): Promise<ProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      where: {
        organizationId,
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
    await this.findProductById(productId, organizationId);

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
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
