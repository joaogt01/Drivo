import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ChangePasswordDto } from './change-password.dto';

describe('ChangePasswordDto', () => {
  const dadosValidos = {
    currentPassword: 'senha-antiga',
    newPassword: 'senha-nova-segura',
  };

  async function validar(dados: object) {
    return validate(plainToInstance(ChangePasswordDto, dados));
  }

  it('aceita dados válidos', async () => {
    expect(await validar(dadosValidos)).toHaveLength(0);
  });

  it('rejeita senha atual vazia', async () => {
    const erros = await validar({
      ...dadosValidos,
      currentPassword: '',
    });

    const erro = erros.find((item) => item.property === 'currentPassword');

    expect(erro).toBeDefined();
    expect(erro?.constraints?.minLength).toBe('Informe sua senha atual.');
  });

  it('rejeita senha atual que não seja texto', async () => {
    const erros = await validar({
      ...dadosValidos,
      currentPassword: 123456,
    });

    expect(erros.some((item) => item.property === 'currentPassword')).toBe(true);
  });

  it('rejeita nova senha com menos de 8 caracteres', async () => {
    const erros = await validar({
      ...dadosValidos,
      newPassword: '1234567',
    });

    const erro = erros.find((item) => item.property === 'newPassword');

    expect(erro).toBeDefined();
    expect(erro?.constraints?.minLength).toBe(
      'A nova senha deve ter pelo menos 8 caracteres.',
    );
  });

  it('rejeita nova senha que não seja texto', async () => {
    const erros = await validar({
      ...dadosValidos,
      newPassword: 12345678,
    });

    expect(erros.some((item) => item.property === 'newPassword')).toBe(true);
  });

  it('rejeita campos ausentes', async () => {
    const erros = await validar({});

    expect(erros.some((item) => item.property === 'currentPassword')).toBe(true);
    expect(erros.some((item) => item.property === 'newPassword')).toBe(true);
  });
});
