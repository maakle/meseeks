import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserNotFoundError } from './user.errors';
import { Logger } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    // Mock the Logger
    loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              upsert: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  describe('findUserById', () => {
    it('should throw UserNotFoundError when user is not found', async () => {
      // Mock Prisma to return null (user not found)
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      // Attempt to find non-existent user
      await expect(service.findUserById('non-existent-id')).rejects.toThrow(
        UserNotFoundError,
      );

      // Verify error was logged
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error in findUserById'),
        expect.any(String),
      );
    });

    it('should handle database errors gracefully', async () => {
      // Mock Prisma to throw a database error
      const dbError = new Error('Database connection failed');
      jest.spyOn(prisma.user, 'findUnique').mockRejectedValue(dbError);

      // Attempt to find user
      await expect(service.findUserById('some-id')).rejects.toThrow(
        'Database connection failed',
      );

      // Verify error was logged
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error in findUserById'),
        expect.any(String),
      );
    });
  });
});
