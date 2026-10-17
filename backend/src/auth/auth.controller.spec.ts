import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const authService = {
    register: jest.fn(),
    login: jest.fn(),
    changePassword: jest.fn(),
  };

  const request = {
    user: {
      id: 'user-123',
      email: 'teste@example.com',
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve registrar um usuário', async () => {
    const dto = {
      name: 'Usuário Teste',
      email: 'teste@example.com',
      password: 'senha-segura-123',
    } as any;

    const result = {
      user: { id: 'user-123', name: dto.name, email: dto.email },
      accessToken: 'token-teste',
    };

    authService.register.mockResolvedValue(result);

    await expect(controller.register(dto)).resolves.toEqual(result);
    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('deve autenticar um usuário', async () => {
    const dto = {
      email: 'teste@example.com',
      password: 'senha-segura-123',
    } as any;

    const result = {
      user: { id: 'user-123', email: dto.email },
      accessToken: 'token-teste',
    };

    authService.login.mockResolvedValue(result);

    await expect(controller.login(dto)).resolves.toEqual(result);
    expect(authService.login).toHaveBeenCalledWith(dto);
  });

  it('deve retornar o perfil do usuário autenticado', () => {
    expect(controller.getProfile(request)).toEqual(request.user);
  });

  it('deve alterar a senha do usuário autenticado', async () => {
    const dto = {
      currentPassword: 'senha-antiga',
      newPassword: 'senha-nova-segura-123',
    } as any;

    const result = { message: 'Senha alterada com sucesso' };

    authService.changePassword.mockResolvedValue(result);

    await expect(
      controller.changePassword(request, dto),
    ).resolves.toEqual(result);

    expect(authService.changePassword).toHaveBeenCalledWith(
      'user-123',
      dto,
    );
  });
});
