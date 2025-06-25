import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

// Common validation classes
export class PaginationDto {
    @IsNumber()
    @IsPositive()
    page: number = 1;

    @IsNumber()
    @IsPositive()
    limit: number = 10;
}

export class SearchDto {
    @IsOptional()
    @IsString()
    query?: string;
}

export class SortDto {
    @IsOptional()
    @IsString()
    sortBy?: string;

    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortOrder: 'asc' | 'desc' = 'desc';
}

// Type exports
export type PaginationType = PaginationDto;
export type SearchType = SearchDto;
export type SortType = SortDto; 