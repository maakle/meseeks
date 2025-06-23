import { BadRequestException, NotFoundException } from '@nestjs/common';

export class UserNotFoundError extends NotFoundException {
  constructor(identifier: string, type: 'id' | 'phoneNumber' | 'clerkUserId') {
    super(`User not found with ${type}: ${identifier}`);
  }
}

export class UserOperationError extends BadRequestException {
  constructor(operation: string, details: string) {
    super(`Error during user ${operation}: ${details}`);
  }
}
