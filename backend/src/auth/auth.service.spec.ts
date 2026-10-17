import { jest } from '@jest/globals';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

const bcryptMock = {
  hash: jest.fn(),
  compare: jest.fn(),
};
jest.unstable_mockModule('bcrypt', () => ({
  default: bcryptMock,
  ...bcryptMock,
}));

describe('AuthService', () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const jwt = {
    signAsync: jest.fn(),
  };

  let service: import('./auth.service').AuthService;
  let AuthServiceClass: typeof import('./auth.service').AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    AuthServiceClass = (await import('./auth.service')).AuthService;
    service = new AuthServiceClass(
      prisma as unknown as PrismaService,
      jwt as unknown as JwtService,
    );
  });

  describe('register', () => {
    it('cadastra usuário com e-mail normalizado e senha protegida', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      bcryptMock.hash.mockResolvedValue('hash-seguro');
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        name: 'João',
        email: 'joao@example.com',
        createdAt: new Date('2026-01-01'),
      });
      jwt.signAsync.mockResolvedValue('token-teste');

      const result = await service.register({
        name: ' João ',
        email: ' JOAO@EXAMPLE.COM ',
        password: 'senha-segura-123',
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'joao@example.com' },
      });
      expect(bcryptMock.hash).toHaveBeenCalledWith('senha-segura-123', 12);
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            name: 'João',
            email: 'joao@example.com',
            passwordHash: 'hash-seguro',
          },
        }),
      );
      expect(result.accessToken).toBe('token-teste');
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('rejeita e-mail já cadastrado', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'joao@example.com',
      });

      await expect(
        service.register({
          name: 'João',
          email: 'JOAO@example.com',
          password: 'senha-segura-123',
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('autentica e não retorna o hash da senha', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        name: 'João',
        email: 'joao@example.com',
        passwordHash: 'hash-seguro',
        createdAt: new Date('2026-01-01'),
      });
      bcryptMock.compare.mockResolvedValue(true);
      jwt.signAsync.mockResolvedValue('token-teste');

      const result = await service.login({
        email: ' JOAO@EXAMPLE.COM ',
        password: 'senha-segura-123',
      });

      expect(result.accessToken).toBe('token-teste');
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(bcryptMock.compare).toHaveBeenCalledWith(
        'senha-segura-123',
        'hash-seguro',
      );
    });

    it('rejeita usuário inexistente', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'naoexiste@example.com',
          password: 'senha-qualquer',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(bcryptMock.compare).not.toHaveBeenCalled();
    });

    it('rejeita senha incorreta', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'joao@example.com',
        passwordHash: 'hash-seguro',
      });
      bcryptMock.compare.mockResolvedValue(false);

      await expect(
        service.login({
          email: 'joao@example.com',
          password: 'senha-errada',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(jwt.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    it('altera a senha quando a senha atual é válida', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        passwordHash: 'hash-antigo',
      });
      bcryptMock.compare.mockResolvedValue(true);
      bcryptMock.hash.mockResolvedValue('hash-novo');
      prisma.user.update.mockResolvedValue({});

      const result = await service.changePassword('user-1', {
        currentPassword: 'senha-antiga',
        newPassword: 'senha-nova-segura',
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { passwordHash: 'hash-novo' },
      });
      expect(result.message).toBe('Senha alterada com sucesso.');
    });

    it('não altera a senha quando a senha atual está errada', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        passwordHash: 'hash-antigo',
      });
      bcryptMock.compare.mockResolvedValue(false);

      await expect(
        service.changePassword('user-1', {
          currentPassword: 'errada',
          newPassword: 'senha-nova-segura',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('rejeita usuário inexistente', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.changePassword('inexistente', {
          currentPassword: 'senha-antiga',
          newPassword: 'senha-nova-segura',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });
});
