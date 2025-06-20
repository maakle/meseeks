import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { OrganizationsService } from '../organizations/organizations.service';
import { UserService } from '../user/user.service';
import { WebhookService } from './webhook.service';

describe('WebhookService', () => {
  let service: WebhookService;

  const mockUserService = {
    upsertClerkUser: jest.fn(),
    deleteUserByClerkId: jest.fn(),
  };

  const mockOrganizationsService = {
    upsertClerkOrganization: jest.fn(),
    deleteOrganizationByClerkId: jest.fn(),
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
      providers: [
        WebhookService,
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
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<WebhookService>(WebhookService);

    // Mock the webhook secret
    mockConfigService.get.mockReturnValue('test-webhook-secret');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyWebhookSignature', () => {
    it('should verify webhook signature successfully', async () => {
      // Mock the request body
      mockRequest.body = { test: 'data' };

      await expect(service.verifyWebhookSignature(mockRequest)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockConfigService.get).toHaveBeenCalledWith(
        'CLERK_WEBHOOK_SECRET',
      );
    });

    it('should throw error when webhook secret is not configured', async () => {
      mockConfigService.get.mockReturnValue(null);

      await expect(service.verifyWebhookSignature(mockRequest)).rejects.toThrow(
        'Webhook secret not configured',
      );
    });
  });

  describe('handleUserEvent', () => {
    it('should handle user.created event', async () => {
      const mockEvent = {
        type: 'user.created',
        data: {
          id: 'user_123',
          email_addresses: [
            {
              id: 'email_1',
              email_address: 'test@example.com',
              linked_to: [],
              object: 'email_address',
              verification: { status: 'verified', strategy: 'ticket' },
            },
          ],
          phone_numbers: [],
          primary_email_address_id: 'email_1',
          primary_phone_number_id: null,
          object: 'user',
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
        object: 'event',
        timestamp: 1654012591835,
      };

      mockUserService.upsertClerkUser.mockResolvedValue({
        id: 'local_user_123',
        clerkUserId: 'user_123',
        email: 'test@example.com',
        phoneNumber: null,
      });

      await service.handleUserEvent(mockEvent);

      expect(mockUserService.upsertClerkUser).toHaveBeenCalledWith({
        clerkUserId: 'user_123',
        email: 'test@example.com',
        phoneNumber: null,
        firstName: 'Test',
        lastName: 'User',
      });
    });

    it('should handle user.updated event', async () => {
      const mockEvent = {
        type: 'user.updated',
        data: {
          id: 'user_123',
          email_addresses: [
            {
              id: 'email_1',
              email_address: 'updated@example.com',
              linked_to: [],
              object: 'email_address',
              verification: { status: 'verified', strategy: 'admin' },
            },
          ],
          phone_numbers: [
            {
              id: 'phone_1',
              phone_number: '+1234567890',
              linked_to: [],
              object: 'phone_number',
              verification: { status: 'verified', strategy: 'admin' },
            },
          ],
          primary_email_address_id: 'email_1',
          primary_phone_number_id: 'phone_1',
          object: 'user',
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
        object: 'event',
        timestamp: 1654012824306,
      };

      mockUserService.upsertClerkUser.mockResolvedValue({
        id: 'local_user_123',
        clerkUserId: 'user_123',
        email: 'updated@example.com',
        phoneNumber: '+1234567890',
      });

      await service.handleUserEvent(mockEvent);

      expect(mockUserService.upsertClerkUser).toHaveBeenCalledWith({
        clerkUserId: 'user_123',
        email: 'updated@example.com',
        phoneNumber: '+1234567890',
        firstName: 'Updated',
        lastName: null,
      });
    });

    it('should handle user.deleted event', async () => {
      const mockEvent = {
        type: 'user.deleted',
        data: {
          deleted: true,
          id: 'user_123',
          object: 'user',
        },
        event_attributes: {
          http_request: {
            client_ip: '0.0.0.0',
            user_agent: 'test-agent',
          },
        },
        object: 'event',
        timestamp: 1661861640000,
      };

      mockUserService.deleteUserByClerkId.mockResolvedValue(undefined);

      await service.handleUserEvent(mockEvent);

      expect(mockUserService.deleteUserByClerkId).toHaveBeenCalledWith(
        'user_123',
      );
    });

    it('should handle unknown user event type', async () => {
      const mockEvent = {
        type: 'user.unknown',
        data: {},
      };

      await service.handleUserEvent(mockEvent);

      expect(mockUserService.upsertClerkUser).not.toHaveBeenCalled();
      expect(mockUserService.deleteUserByClerkId).not.toHaveBeenCalled();
    });
  });

  describe('handleOrganizationEvent', () => {
    it('should handle organization.created event', async () => {
      const mockEvent = {
        type: 'organization.created',
        data: {
          id: 'org_123',
          name: 'Test Organization',
          slug: 'test-org',
          image_url: null,
          created_at: 1654012591514,
          updated_at: 1654012591835,
          object: 'organization',
          public_metadata: {},
          private_metadata: {},
          unsafe_metadata: {},
        },
        event_attributes: {
          http_request: {
            client_ip: '0.0.0.0',
            user_agent: 'test-agent',
          },
        },
        object: 'event',
        timestamp: 1654012591835,
      };

      mockOrganizationsService.upsertClerkOrganization.mockResolvedValue({
        id: 'local_org_123',
        clerkOrganizationId: 'org_123',
        name: 'Test Organization',
        slug: 'test-org',
      });

      await service.handleOrganizationEvent(mockEvent);

      expect(
        mockOrganizationsService.upsertClerkOrganization,
      ).toHaveBeenCalledWith({
        clerkOrganizationId: 'org_123',
        name: 'Test Organization',
        slug: 'test-org',
      });
    });

    it('should handle organization.updated event', async () => {
      const mockEvent = {
        type: 'organization.updated',
        data: {
          id: 'org_123',
          name: 'Updated Organization',
          slug: 'updated-org',
          image_url: null,
          created_at: 1654012591514,
          updated_at: 1654012824306,
          object: 'organization',
          public_metadata: {},
          private_metadata: {},
          unsafe_metadata: {},
        },
        event_attributes: {
          http_request: {
            client_ip: '0.0.0.0',
            user_agent: 'test-agent',
          },
        },
        object: 'event',
        timestamp: 1654012824306,
      };

      mockOrganizationsService.upsertClerkOrganization.mockResolvedValue({
        id: 'local_org_123',
        clerkOrganizationId: 'org_123',
        name: 'Updated Organization',
        slug: 'updated-org',
      });

      await service.handleOrganizationEvent(mockEvent);

      expect(
        mockOrganizationsService.upsertClerkOrganization,
      ).toHaveBeenCalledWith({
        clerkOrganizationId: 'org_123',
        name: 'Updated Organization',
        slug: 'updated-org',
      });
    });

    it('should handle organization.deleted event', async () => {
      const mockEvent = {
        type: 'organization.deleted',
        data: {
          deleted: true,
          id: 'org_123',
          object: 'organization',
        },
        event_attributes: {
          http_request: {
            client_ip: '0.0.0.0',
            user_agent: 'test-agent',
          },
        },
        object: 'event',
        timestamp: 1661861640000,
      };

      mockOrganizationsService.deleteOrganizationByClerkId.mockResolvedValue(
        undefined,
      );

      await service.handleOrganizationEvent(mockEvent);

      expect(
        mockOrganizationsService.deleteOrganizationByClerkId,
      ).toHaveBeenCalledWith('org_123');
    });

    it('should handle unknown organization event type', async () => {
      const mockEvent = {
        type: 'organization.unknown',
        data: {},
      };

      await service.handleOrganizationEvent(mockEvent);

      expect(
        mockOrganizationsService.upsertClerkOrganization,
      ).not.toHaveBeenCalled();
      expect(
        mockOrganizationsService.deleteOrganizationByClerkId,
      ).not.toHaveBeenCalled();
    });
  });
});
