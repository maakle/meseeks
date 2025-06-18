import { Test, TestingModule } from '@nestjs/testing';
import { AudioService } from './audio.service';

jest.mock('openai');

describe('AudioService', () => {
  let service: AudioService;

  beforeEach(async () => {
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.AUDIO_FILES_FOLDER = 'test-audio';

    const module: TestingModule = await Test.createTestingModule({
      providers: [AudioService],
    }).compile();

    service = module.get<AudioService>(AudioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
