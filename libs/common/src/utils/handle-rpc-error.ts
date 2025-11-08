import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Maneja errores que provienen de microservicios (RpcException)
 * y lanza un HttpException con el status y mensaje correcto.
 */
export function handleRpcError(service: string, error: any): never {
  const statusCode = error?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
  const message = error?.message ?? `Error interno en ${service}`;

  throw new HttpException(message, statusCode);
}