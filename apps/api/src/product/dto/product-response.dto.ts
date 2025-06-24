import { ApiProperty } from '@nestjs/swagger';
import { FileUploadResponseDto } from '../../common/dto/upload-files.dto';

export class ProductResponseDto {
  @ApiProperty({ description: 'Product ID' })
  id!: string;

  @ApiProperty({ description: 'Product name' })
  name!: string;

  @ApiProperty({ description: 'Product category' })
  category!: string;

  @ApiProperty({ description: 'Product description' })
  description!: string;

  @ApiProperty({ description: 'Organization ID' })
  organizationId!: string;

  @ApiProperty({
    description: 'Product images',
    type: [FileUploadResponseDto],
    required: false,
  })
  images?: FileUploadResponseDto[];

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;
}
