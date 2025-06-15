import { Logger } from '@nestjs/common';

export function HandleServiceError(serviceName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const logger = new Logger(serviceName);

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        logger.error(
          `Error in ${propertyKey}:`,
          error instanceof Error ? error.message : error,
        );
        throw error;
      }
    };

    return descriptor;
  };
}
