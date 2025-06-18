import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiService } from './openai.service';
import { UserService } from '../user/user.service';
import { MessageService } from '../message/message.service';

describe('OpenaiService', () => {
  let service: OpenaiService;

  const mockUserService = {
    upsertUser: jest.fn(),
  };

  const mockMessageService = {
    createAndManyFetchMessages: jest.fn(),
    createMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenaiService,
        { provide: UserService, useValue: mockUserService },
        { provide: MessageService, useValue: mockMessageService },
      ],
    }).compile();

    service = module.get<OpenaiService>(OpenaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
