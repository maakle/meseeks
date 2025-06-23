import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateOrganizationMembershipRoleDto {
  @ApiProperty({
    description: 'Role for the organization membership',
    example: 'admin',
    minLength: 1
  })
  @IsString()
  @MinLength(1, { message: 'Role is required' })
  role!: string;
}
