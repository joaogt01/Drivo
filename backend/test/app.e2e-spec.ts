import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthService } from '../src/auth/auth.service';

describe('API (e2e)', () => {
  let app: INestApplication<App>;

  const authService = {
    register: jest.fn(),
    login: jest.fn(),
    changePassword: jest.fn(),
  };

  const prismaService = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    vehicle: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeAll(async () => {
    process.env.JWT_SECRET = 'segredo-de-teste-e2e';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET / retorna 200 e Hello World!', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('POST /auth/register encaminha dados válidos ao serviço', async () => {
    authService.register.mockResolvedValue({
      user: {
        id: 'user-1',
        name: 'João',
        email: 'joao@example.com',
      },
      accessToken: 'token-teste',
    });

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'João',
        email: 'joao@example.com',
        password: 'senha-segura-123',
      })
      .expect(201);

    expect(authService.register).toHaveBeenCalledWith({
      name: 'João',
      email: 'joao@example.com',
      password: 'senha-segura-123',
    });
  });

  it('POST /auth/register rejeita dados inválidos', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'J',
        email: 'email-invalido',
        password: '123',
      })
      .expect(400);

    expect(authService.register).not.toHaveBeenCalled();
  });

  it('POST /auth/login retorna 200 para credenciais válidas', async () => {
    authService.login.mockResolvedValue({
      user: {
        id: 'user-1',
        name: 'João',
        email: 'joao@example.com',
      },
      accessToken: 'token-teste',
    });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'joao@example.com',
        password: 'senha-segura-123',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.accessToken).toBe('token-teste');
        expect(body.user.passwordHash).toBeUndefined();
      });
  });

  it('POST /auth/login rejeita dados inválidos', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'invalido',
        password: '',
      })
      .expect(400);

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('GET /auth/me rejeita acesso sem token', async () => {
    await request(app.getHttpServer())
      .get('/auth/me')
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
