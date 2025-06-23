import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { OrganizationsService } from '../organizations/organizations.service';
import { UserService } from '../user/user.service';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

describe('WebhookController', () => {
  let controller: WebhookController;

  const mockUserService = {
    upsertClerkUser: jest.fn(),
    deleteUserByClerkId: jest.fn(),
  };

  const mockOrganizationsService = {
    upsertClerkOrganization: jest.fn(),
    deleteOrganizationByClerkId: jest.fn(),
  };

  const mockWebhookService = {
    verifyWebhookSignature: jest.fn(),
    handleUserEvent: jest.fn(),
    handleOrganizationEvent: jest.fn(),
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
          provide: WebhookService,
          useValue: mockWebhookService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: OrganizationsService,
          useValue: mockOrganizationsService,
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<WebhookController>(WebhookController);
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

      mockWebhookService.verifyWebhookSignature.mockResolvedValue(undefined);
      mockWebhookService.handleUserEvent.mockResolvedValue(undefined);

      const result = await controller.handleClerkWebhook(
        mockRequest,
        mockEvent,
      );

      expect(result).toEqual({ received: true });
      expect(mockWebhookService.verifyWebhookSignature).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(mockWebhookService.handleUserEvent).toHaveBeenCalledWith(
        mockEvent,
      );
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

      mockWebhookService.verifyWebhookSignature.mockResolvedValue(undefined);
      mockWebhookService.handleUserEvent.mockResolvedValue(undefined);

      const result = await controller.handleClerkWebhook(
        mockRequest,
        mockEvent,
      );

      expect(result).toEqual({ received: true });
      expect(mockWebhookService.verifyWebhookSignature).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(mockWebhookService.handleUserEvent).toHaveBeenCalledWith(
        mockEvent,
      );
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

      mockWebhookService.verifyWebhookSignature.mockResolvedValue(undefined);
      mockWebhookService.handleUserEvent.mockResolvedValue(undefined);

      const result = await controller.handleClerkWebhook(
        mockRequest,
        mockEvent,
      );

      expect(result).toEqual({ received: true });
      expect(mockWebhookService.verifyWebhookSignature).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(mockWebhookService.handleUserEvent).toHaveBeenCalledWith(
        mockEvent,
      );
    });

    it('should handle organization.created event', async () => {
      const mockEvent = {
        type: 'organization.created' as const,
        data: {
          id: 'org_29w9IfBrPmcpi0IeBVaKtA7R94W',
          name: 'Acme Inc',
          slug: 'acme-inc',
          image_url: 'https://img.clerk.com/xxxxxx',
          logo_url: 'https://example.org/example.png',
          created_at: 1654013202977,
          updated_at: 1654013202977,
          created_by: 'user_1vq84bqWzw7qmFgqSwN4CH1Wp0n',
          object: 'organization' as const,
          public_metadata: {},
        },
        event_attributes: {
          http_request: {
            client_ip: '0.0.0.0',
            user_agent:
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          },
        },
        object: 'event' as const,
        timestamp: 1654013202977,
      };

      // Mock the request body
      mockRequest.body = mockEvent;

      mockWebhookService.verifyWebhookSignature.mockResolvedValue(undefined);
      mockWebhookService.handleOrganizationEvent.mockResolvedValue(undefined);

      const result = await controller.handleClerkWebhook(
        mockRequest,
        mockEvent,
      );

      expect(result).toEqual({ received: true });
      expect(mockWebhookService.verifyWebhookSignature).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(mockWebhookService.handleOrganizationEvent).toHaveBeenCalledWith(
        mockEvent,
      );
    });

    it('should handle organization.updated event', async () => {
      const mockEvent = {
        type: 'organization.updated' as const,
        data: {
          id: 'org_29w9IfBrPmcpi0IeBVaKtA7R94W',
          name: 'Acme Inc',
          slug: 'acme-inc',
          image_url: 'https://img.clerk.com/xxxxxx',
          logo_url: 'https://example.com/example.png',
          created_at: 1654013202977,
          updated_at: 1654013466465,
          created_by: 'user_1vq84bqWzw7qmFgqSwN4CH1Wp0n',
          object: 'organization' as const,
          public_metadata: {},
        },
        event_attributes: {
          http_request: {
            client_ip: '',
            user_agent: '',
          },
        },
        object: 'event' as const,
        timestamp: 1654013466465,
      };

      // Mock the request body
      mockRequest.body = mockEvent;

      mockWebhookService.verifyWebhookSignature.mockResolvedValue(undefined);
      mockWebhookService.handleOrganizationEvent.mockResolvedValue(undefined);

      const result = await controller.handleClerkWebhook(
        mockRequest,
        mockEvent,
      );

      expect(result).toEqual({ received: true });
      expect(mockWebhookService.verifyWebhookSignature).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(mockWebhookService.handleOrganizationEvent).toHaveBeenCalledWith(
        mockEvent,
      );
    });

    it('should handle organization.deleted event', async () => {
      const mockEvent = {
        type: 'organization.deleted' as const,
        data: {
          deleted: true as const,
          id: 'org_29w9IfBrPmcpi0IeBVaKtA7R94W',
          object: 'organization' as const,
        },
        event_attributes: {
          http_request: {
            client_ip: '',
            user_agent: '',
          },
        },
        object: 'event' as const,
        timestamp: 1661861640000,
      };

      // Mock the request body
      mockRequest.body = mockEvent;

      mockWebhookService.verifyWebhookSignature.mockResolvedValue(undefined);
      mockWebhookService.handleOrganizationEvent.mockResolvedValue(undefined);

      const result = await controller.handleClerkWebhook(
        mockRequest,
        mockEvent,
      );

      expect(result).toEqual({ received: true });
      expect(mockWebhookService.verifyWebhookSignature).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(mockWebhookService.handleOrganizationEvent).toHaveBeenCalledWith(
        mockEvent,
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

      mockWebhookService.verifyWebhookSignature.mockResolvedValue(undefined);

      const result = await controller.handleClerkWebhook(
        mockRequest,
        mockEvent,
      );

      expect(result).toEqual({ received: true });
      expect(mockWebhookService.verifyWebhookSignature).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(mockWebhookService.handleUserEvent).not.toHaveBeenCalled();
      expect(mockWebhookService.handleOrganizationEvent).not.toHaveBeenCalled();
    });

    it('should handle webhook signature verification failure', async () => {
      const mockEvent = {
        type: 'user.created' as const,
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

      mockWebhookService.verifyWebhookSignature.mockRejectedValue(
        new Error('Invalid webhook signature'),
      );

      await expect(
        controller.handleClerkWebhook(mockRequest, mockEvent),
      ).rejects.toThrow('Invalid webhook signature');

      expect(mockWebhookService.verifyWebhookSignature).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(mockWebhookService.handleUserEvent).not.toHaveBeenCalled();
    });
  });
});
