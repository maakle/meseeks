import {
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

export class MessageNotFoundError extends NotFoundException {
  constructor(identifier: string, field: string) {
    super(`Message not found with ${field}: ${identifier}`);
  }
}

export class MessageCreationError extends BadRequestException {
  constructor(message: string) {
    super(`Failed to create message: ${message}`);
  }
}

export class MessageFetchError extends InternalServerErrorException {
  constructor(message: string) {
    super(`Failed to fetch messages: ${message}`);
  }
}
