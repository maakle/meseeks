// API response types
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T = any> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ApiError {
    message: string;
    code?: string;
    details?: any;
}

// HTTP status types
export type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500; 