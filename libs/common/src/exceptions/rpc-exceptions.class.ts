import { RpcException } from '@nestjs/microservices';

export class HandledRpcException extends RpcException {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
  ) {
    super({ statusCode, message });
  }
}
