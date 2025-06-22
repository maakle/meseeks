import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Organization name',
    example: 'Acme Corp'
  })
  @IsString()
  @MinLength(1, { message: 'Organization name is required' })
  name!: string;
}
