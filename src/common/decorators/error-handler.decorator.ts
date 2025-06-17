import { Logger } from '@nestjs/common';

export function HandleServiceErrors(serviceName: string) {
  return function (target: any) {
    const logger = new Logger(serviceName);

    // Get all method names from the prototype
    const methodNames = Object.getOwnPropertyNames(target.prototype).filter(
      (name) =>
        name !== 'constructor' && typeof target.prototype[name] === 'function',
    );

    // Apply error handling to each method
    methodNames.forEach((methodName) => {
      const originalMethod = target.prototype[methodName];

      target.prototype[methodName] = async function (...args: any[]) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          logger.error(
            `Error in ${methodName}:`,
            error instanceof Error ? error.message : error,
          );
          throw error;
        }
      };
    });
  };
}
