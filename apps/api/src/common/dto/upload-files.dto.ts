import { ApiProperty } from '@nestjs/swagger';

export class FileUploadResponseDto {
  @ApiProperty({ description: 'Unique file ID' })
  id!: string;

  @ApiProperty({ description: 'Original file name' })
  name!: string;

  @ApiProperty({ description: 'File key in storage' })
  key!: string;

  @ApiProperty({ description: 'Presigned URL for file access' })
  url!: string;

  @ApiProperty({ description: 'Image width (if image)', required: false })
  width?: number;

  @ApiProperty({ description: 'Image height (if image)', required: false })
  height?: number;

  @ApiProperty({ description: 'File MIME type' })
  mimeType!: string;

  @ApiProperty({ description: 'File size in bytes' })
  size!: number;

  @ApiProperty({ description: 'Alt text for accessibility', required: false })
  altText?: string;
}

export class UploadFilesResponseDto {
  @ApiProperty({ description: 'Uploaded files', type: [FileUploadResponseDto] })
  files!: FileUploadResponseDto[];

  @ApiProperty({ description: 'Total number of files uploaded' })
  totalFiles!: number;
}
