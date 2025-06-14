export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User with id ${id} not found`);
    this.name = 'UserNotFoundError';
  }
}

export class DuplicatePhoneNumberError extends Error {
  constructor(phoneNumber: string) {
    super(`User with phone number ${phoneNumber} already exists`);
    this.name = 'DuplicatePhoneNumberError';
  }
}

export class InvalidPhoneNumberError extends Error {
  constructor(phoneNumber: string) {
    super(`Invalid phone number format: ${phoneNumber}`);
    this.name = 'InvalidPhoneNumberError';
  }
}
