import { Test, TestingModule } from '@nestjs/testing';
import { AudioService } from '../audio/audio.service';
import { OpenaiService } from '../openai/openai.service';
import { StabilityaiService } from '../stabilityai/stabilityai.service';
import { UserService } from '../user/user.service';
import { WhatsappWebhookEventDto } from './dto/whatsapp-webhook.dto';
import { WhatsappWebhookController } from './webhook.controller';
import { WhatsappService } from './whatsapp.service';

describe('WhatsappWebhookController', () => {
  let controller: WhatsappWebhookController;
  let whatsappService: jest.Mocked<WhatsappService>;

  beforeEach(async () => {
    const mockWhatsappService = {
      markMessageAsRead: jest.fn(),
      sendWhatsAppMessage: jest.fn(),
      sendImageByUrl: jest.fn(),
      sendAudioByUrl: jest.fn(),
      downloadMedia: jest.fn(),
    };

    const mockStabilityaiService = {
      textToImage: jest.fn(),
    };

    const mockAudioService = {
      convertAudioToText: jest.fn(),
      convertTextToSpeech: jest.fn(),
    };

    const mockOpenaiService = {
      generateAIResponse: jest.fn(),
    };

    const mockUserService = {
      // Add any user service methods if needed
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhatsappWebhookController],
      providers: [
        {
          provide: WhatsappService,
          useValue: mockWhatsappService,
        },
        {
          provide: StabilityaiService,
          useValue: mockStabilityaiService,
        },
        {
          provide: AudioService,
          useValue: mockAudioService,
        },
        {
          provide: OpenaiService,
          useValue: mockOpenaiService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<WhatsappWebhookController>(
      WhatsappWebhookController,
    );
    whatsappService = module.get(WhatsappService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleWhatsappWebhook', () => {
    it('should process text message webhook successfully', async () => {
      const mockWebhookEvent: WhatsappWebhookEventDto = {
        object: 'whatsapp_business_account',
        entry: [
          {
            id: 'test-entry-id',
            changes: [
              {
                value: {
                  messaging_product: 'whatsapp',
                  metadata: {
                    display_phone_number: '+1234567890',
                    phone_number_id: 'test-phone-id',
                  },
                  messages: [
                    {
                      from: '+1234567890',
                      id: 'test-message-id',
                      timestamp: '1234567890',
                      type: 'text',
                      text: {
                        body: 'Hello, world!',
                      },
                    },
                  ],
                },
                field: 'messages',
              },
            ],
          },
        ],
      };

      whatsappService.markMessageAsRead.mockResolvedValue(undefined);
      whatsappService.sendWhatsAppMessage.mockResolvedValue(undefined);

      const result = await controller.handleWhatsappWebhook(mockWebhookEvent);

      expect(result).toEqual({ received: true });
      expect(whatsappService.markMessageAsRead).toHaveBeenCalledWith(
        'test-message-id',
      );
      expect(whatsappService.sendWhatsAppMessage).toHaveBeenCalledWith(
        '+1234567890',
        'Hello, world!',
        'test-message-id',
      );
    });

    it('should handle webhook with no messages gracefully', async () => {
      const mockWebhookEvent: WhatsappWebhookEventDto = {
        object: 'whatsapp_business_account',
        entry: [
          {
            id: 'test-entry-id',
            changes: [
              {
                value: {
                  messaging_product: 'whatsapp',
                  metadata: {
                    display_phone_number: '+1234567890',
                    phone_number_id: 'test-phone-id',
                  },
                  messages: [],
                },
                field: 'messages',
              },
            ],
          },
        ],
      };

      const result = await controller.handleWhatsappWebhook(mockWebhookEvent);

      expect(result).toEqual({ received: true });
      expect(whatsappService.markMessageAsRead).not.toHaveBeenCalled();
    });
  });

  describe('verifyWebhook', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should verify webhook successfully with valid token', async () => {
      process.env.WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN = 'test-token';

      const query = {
        'hub.mode': 'subscribe',
        'hub.challenge': 'test-challenge',
        'hub.verify_token': 'test-token',
      };

      const result = await controller.verifyWebhook(query);

      expect(result).toBe('test-challenge');
    });

    it('should return error for invalid token', async () => {
      process.env.WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN = 'test-token';

      const query = {
        'hub.mode': 'subscribe',
        'hub.challenge': 'test-challenge',
        'hub.verify_token': 'wrong-token',
      };

      const result = await controller.verifyWebhook(query);

      expect(result).toBe('Error verifying token');
    });

    it('should return error for missing parameters', async () => {
      const query = {
        'hub.mode': '',
        'hub.challenge': 'test-challenge',
        'hub.verify_token': '',
      };

      const result = await controller.verifyWebhook(query);

      expect(result).toBe('Error verifying token');
    });
  });
});
