import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createId } from '@paralleldrive/cuid2';
import * as sharp from 'sharp';

export interface FileUploadResult {
  id: string;
  name: string;
  key: string;
  url: string;
  width?: number;
  height?: number;
  mimeType: string;
  size: number;
  altText?: string;
}

export interface FileMetadata {
  width?: number;
  height?: number;
  mimeType: string;
  size: number;
}

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;
  private readonly endpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>(
      'MINIO_BUCKET_NAME',
      'meseeks',
    );
    this.region = this.configService.get<string>('MINIO_REGION', 'us-east-1');
    this.endpoint = this.configService.get<string>(
      'MINIO_ENDPOINT',
      'http://localhost:9000',
    );

    this.s3Client = new S3Client({
      region: this.region,
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: this.configService.get<string>(
          'MINIO_ACCESS_KEY_ID',
          'minioadmin',
        ),
        secretAccessKey: this.configService.get<string>(
          'MINIO_SECRET_ACCESS_KEY',
          'minioadmin',
        ),
      },
      forcePathStyle: true, // Required for MinIO
    });
  }

  /**
   * Upload a file to MinIO/S3
   */
  async uploadFile(
    file: Express.Multer.File,
    entityType: string,
    entityId: string,
    altText?: string,
  ): Promise<FileUploadResult> {
    try {
      // Generate unique file key
      const fileExtension = this.getFileExtension(file.originalname);
      const fileName = `${createId()}.${fileExtension}`;
      const key = `${entityType}/${entityId}/${fileName}`;

      // Process image if it's an image file
      let processedBuffer = file.buffer;
      let metadata: FileMetadata = {
        mimeType: file.mimetype,
        size: file.size,
      };

      if (this.isImageFile(file.mimetype)) {
        const imageMetadata = await this.processImage(file.buffer);
        processedBuffer = imageMetadata.buffer;
        metadata = {
          ...metadata,
          width: imageMetadata.width,
          height: imageMetadata.height,
          size: processedBuffer.length,
        };
      }

      // Upload to MinIO/S3
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: processedBuffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          entityType,
          entityId,
        },
      });

      await this.s3Client.send(uploadCommand);

      // Generate presigned URL for access
      const url = await this.generatePresignedUrl(key);

      return {
        id: createId(),
        name: file.originalname,
        key,
        url,
        width: metadata.width,
        height: metadata.height,
        mimeType: metadata.mimeType,
        size: metadata.size,
        altText,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to upload file: ${errorMessage}`, errorStack);
      throw new BadRequestException('Failed to upload file');
    }
  }

  /**
   * Delete a file from MinIO/S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(deleteCommand);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to delete file: ${errorMessage}`, errorStack);
      throw new BadRequestException('Failed to delete file');
    }
  }

  /**
   * Generate a presigned URL for file access
   */
  async generatePresignedUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to generate presigned URL: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException('Failed to generate file URL');
    }
  }

  /**
   * Process image file (resize, optimize)
   */
  private async processImage(
    buffer: Buffer,
  ): Promise<{ buffer: Buffer; width: number; height: number }> {
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();

      // Resize image if it's too large (max 1920x1080)
      const maxWidth = 1920;
      const maxHeight = 1080;

      let processedImage = image;
      if (metadata.width && metadata.height) {
        if (metadata.width > maxWidth || metadata.height > maxHeight) {
          processedImage = image.resize(maxWidth, maxHeight, {
            fit: 'inside',
            withoutEnlargement: true,
          });
        }
      }

      // Optimize image quality
      const processedBuffer = await processedImage
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();

      const processedMetadata = await sharp(processedBuffer).metadata();

      return {
        buffer: processedBuffer,
        width: processedMetadata.width || 0,
        height: processedMetadata.height || 0,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to process image: ${errorMessage}`, errorStack);
      throw new BadRequestException('Failed to process image');
    }
  }

  /**
   * Check if file is an image
   */
  private isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || 'bin';
  }

  /**
   * Validate file type
   */
  validateFileType(mimeType: string): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'text/plain',
    ];

    return allowedTypes.includes(mimeType);
  }

  /**
   * Validate file size (max 10MB)
   */
  validateFileSize(size: number): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return size <= maxSize;
  }
}
