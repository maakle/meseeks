import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FileStorageService } from '../services/file-storage.service';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  constructor(private readonly fileStorageService: FileStorageService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const files = request.files;

    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // Validate each file
    for (const file of files) {
      if (!this.fileStorageService.validateFileType(file.mimetype)) {
        throw new BadRequestException(
          `Invalid file type: ${file.mimetype}. Allowed types: image/jpeg, image/png, image/webp, image/gif, application/pdf, text/plain`,
        );
      }

      if (!this.fileStorageService.validateFileSize(file.size)) {
        throw new BadRequestException(
          `File too large: ${file.originalname}. Maximum size is 10MB`,
        );
      }
    }

    return next.handle();
  }
}
