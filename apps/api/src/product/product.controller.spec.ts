import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            createProduct: jest.fn(),
            findAllProducts: jest.fn(),
            findProductById: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
            findProductsByCategory: jest.fn(),
            uploadProductFiles: jest.fn(),
            deleteProductFile: jest.fn(),
          },
        },
        {
          provide: 'FileStorageService',
          useValue: {
            validateFileType: jest.fn(),
            validateFileSize: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const createProductDto = {
        name: 'Test Product',
        category: 'Electronics',
        description: 'A test product',
      };
      const organizationId = 'org123';
      const expectedResult = {
        id: 'prod123',
        ...createProductDto,
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
      };

      jest
        .spyOn(productService, 'createProduct')
        .mockResolvedValue(expectedResult);

      const result = await controller.createProduct(
        createProductDto,
        organizationId,
      );

      expect(result).toEqual(expectedResult);
      expect(productService.createProduct).toHaveBeenCalledWith(
        createProductDto,
        organizationId,
      );
    });
  });

  describe('uploadProductFiles', () => {
    it('should upload files for a product', async () => {
      const productId = 'prod123';
      const organizationId = 'org123';
      const mockFiles = [
        {
          fieldname: 'files',
          originalname: 'test.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: Buffer.from('test'),
          size: 1024,
        } as Express.Multer.File,
      ];
      const altTexts = ['Test image'];
      const expectedResult = {
        files: [
          {
            id: 'file123',
            name: 'test.jpg',
            key: 'Product/prod123/file123.jpg',
            url: 'https://example.com/file123.jpg',
            mimeType: 'image/jpeg',
            size: 1024,
            width: 800,
            height: 600,
            altText: 'Test image',
          },
        ],
        totalFiles: 1,
      };

      jest
        .spyOn(productService, 'uploadProductFiles')
        .mockResolvedValue(expectedResult.files);

      const result = await controller.uploadProductFiles(
        productId,
        organizationId,
        mockFiles,
        altTexts,
      );

      expect(result).toEqual(expectedResult);
      expect(productService.uploadProductFiles).toHaveBeenCalledWith(
        productId,
        organizationId,
        mockFiles,
        altTexts,
      );
    });
  });

  describe('deleteProductFile', () => {
    it('should delete a file from a product', async () => {
      const productId = 'prod123';
      const fileId = 'file123';
      const organizationId = 'org123';

      jest
        .spyOn(productService, 'deleteProductFile')
        .mockResolvedValue(undefined);

      await controller.deleteProductFile(productId, fileId, organizationId);

      expect(productService.deleteProductFile).toHaveBeenCalledWith(
        productId,
        organizationId,
        fileId,
      );
    });
  });
});
