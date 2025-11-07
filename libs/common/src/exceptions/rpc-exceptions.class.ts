import { RpcException } from '@nestjs/microservices';

export class CustomRpcException extends RpcException {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
  ) {
    super({ statusCode, message });
  }
}
