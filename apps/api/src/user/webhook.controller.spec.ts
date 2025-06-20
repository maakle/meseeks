import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { UserService } from './user.service';
import { WebhookController } from './webhook.controller';

describe('WebhookController', () => {
  let controller: WebhookController;

  const mockUserService = {
    upsertClerkUser: jest.fn(),
    deleteUserByClerkId: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockRequest = {
    headers: {
      'svix-id': 'test-svix-id',
      'svix-timestamp': '1234567890',
      'svix-signature': 'test-signature',
    },
    body: {},
  } as unknown as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<WebhookController>(WebhookController);

    // Mock the webhook secret
    mockConfigService.get.mockReturnValue('test-webhook-secret');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleClerkWebhook', () => {
    it('should handle user.created event', async () => {
      const mockEvent = {
        type: 'user.created' as const,
        data: {
          id: 'user_123',
          email_addresses: [
            {
              id: 'email_1',
              email_address: 'test@example.com',
              linked_to: [],
              object: 'email_address' as const,
              verification: { status: 'verified', strategy: 'ticket' },
            },
          ],
          phone_numbers: [],
          primary_email_address_id: 'email_1',
          primary_phone_number_id: null,
          object: 'user' as const,
          created_at: 1654012591514,
          updated_at: 1654012591835,
          password_enabled: true,
          two_factor_enabled: false,
          private_metadata: {},
          public_metadata: {},
          unsafe_metadata: {},
          external_accounts: [],
          external_id: null,
          first_name: 'Test',
          last_name: 'User',
          image_url: null,
          last_sign_in_at: null,
          username: null,
          web3_wallets: [],
          profile_image_url: null,
          birthday: '',
          gender: '',
          primary_web3_wallet_id: null,
        },
        event_attributes: {
          http_request: {
            client_ip: '0.0.0.0',
            user_agent: 'test-agent',
          },
        },
        object: 'event' as const,
        timestamp: 1654012591835,
      };

      // Mock the request body
      mockRequest.body = mockEvent;

      mockUserService.upsertClerkUser.mockResolvedValue({
        id: 'local_user_123',
        clerkUserId: 'user_123',
        email: 'test@example.com',
        phoneNumber: null,
      });

      const result = await controller.handleClerkWebhook(
        mockRequest,
        mockEvent,
      );

      expect(result).toEqual({ received: true });
      expect(mockUserService.upsertClerkUser).toHaveBeenCalledWith({
        clerkUserId: 'user_123',
        email: 'test@example.com',
        phoneNumber: null,
      });
    });

    it('should handle user.updated event', async () => {
      const mockEvent = {
        type: 'user.updated' as const,
        data: {
          id: 'user_123',
          email_addresses: [
            {
              id: 'email_1',
              email_address: 'updated@example.com',
              linked_to: [],
              object: 'email_address' as const,
              verification: { status: 'verified', strategy: 'admin' },
            },
          ],
          phone_numbers: [
            {
              id: 'phone_1',
              phone_number: '+1234567890',
              linked_to: [],
              object: 'phone_number' as const,
              verification: { status: 'verified', strategy: 'admin' },
            },
          ],
          primary_email_address_id: 'email_1',
          primary_phone_number_id: 'phone_1',
          object: 'user' as const,
          created_at: 1654012591514,
          updated_at: 1654012824306,
          password_enabled: true,
          two_factor_enabled: false,
          private_metadata: {},
          public_metadata: {},
          unsafe_metadata: {},
          external_accounts: [],
          external_id: null,
          first_name: 'Updated',
          last_name: null,
          image_url: null,
          last_sign_in_at: null,
          username: null,
          web3_wallets: [],
          profile_image_url: null,
          birthday: '',
          gender: '',
          primary_web3_wallet_id: null,
        },
        event_attributes: {
          http_request: {
            client_ip: '0.0.0.0',
            user_agent: 'test-agent',
          },
        },
        object: 'event' as const,
        timestamp: 1654012824306,
      };

      // Mock the request body
      mockRequest.body = mockEvent;

      mockUserService.upsertClerkUser.mockResolvedValue({
        id: 'local_user_123',
        clerkUserId: 'user_123',
        email: 'updated@example.com',
        phoneNumber: '+1234567890',
      });

      const result = await controller.handleClerkWebhook(
        mockRequest,
        mockEvent,
      );

      expect(result).toEqual({ received: true });
      expect(mockUserService.upsertClerkUser).toHaveBeenCalledWith({
        clerkUserId: 'user_123',
        email: 'updated@example.com',
        phoneNumber: '+1234567890',
      });
    });

    it('should handle user.deleted event', async () => {
      const mockEvent = {
        type: 'user.deleted' as const,
        data: {
          deleted: true as const,
          id: 'user_123',
          object: 'user' as const,
        },
        event_attributes: {
          http_request: {
            client_ip: '0.0.0.0',
            user_agent: 'test-agent',
          },
        },
        object: 'event' as const,
        timestamp: 1661861640000,
      };

      // Mock the request body
      mockRequest.body = mockEvent;

      mockUserService.deleteUserByClerkId.mockResolvedValue(undefined);

      const result = await controller.handleClerkWebhook(
        mockRequest,
        mockEvent,
      );

      expect(result).toEqual({ received: true });
      expect(mockUserService.deleteUserByClerkId).toHaveBeenCalledWith(
        'user_123',
      );
    });

    it('should handle unknown event type', async () => {
      const mockEvent = {
        type: 'unknown.event' as any,
        data: {
          id: 'user_123',
          email_addresses: [],
          phone_numbers: [],
          primary_email_address_id: null,
          primary_phone_number_id: null,
          object: 'user' as const,
          created_at: 0,
          updated_at: 0,
          password_enabled: false,
          two_factor_enabled: false,
          private_metadata: {},
          public_metadata: {},
          unsafe_metadata: {},
          external_accounts: [],
          external_id: null,
          first_name: null,
          last_name: null,
          image_url: null,
          last_sign_in_at: null,
          username: null,
          web3_wallets: [],
          profile_image_url: null,
          birthday: '',
          gender: '',
          primary_web3_wallet_id: null,
        },
        event_attributes: {
          http_request: {
            client_ip: '0.0.0.0',
            user_agent: 'test-agent',
          },
        },
        object: 'event' as const,
        timestamp: 1661861640000,
      };

      // Mock the request body
      mockRequest.body = mockEvent;

      const result = await controller.handleClerkWebhook(
        mockRequest,
        mockEvent,
      );

      expect(result).toEqual({ received: true });
      expect(mockUserService.upsertClerkUser).not.toHaveBeenCalled();
      expect(mockUserService.deleteUserByClerkId).not.toHaveBeenCalled();
    });
  });
});
