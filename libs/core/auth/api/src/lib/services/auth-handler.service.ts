export abstract class AuthHandlerService {
  abstract register(
    email: string,
    password: string,
    info?: { displayName?: string; phoneNumber?: string }
  ): Promise<unknown>;
}
