import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.type';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  private getBearer(raw?: string | string[] | null): string | null {
    if (!raw) return null;

    const header = Array.isArray(raw) ? raw[0] : raw;

    const [type, token] = header.trim().split(/\s+/);

    if (!type || !token) return null;

    return type.toLowerCase() === 'bearer' ? token : null;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.getBearer(req.headers['authorization']);

    if (!token) throw new UnauthorizedException('유효하지 않은 토큰입니다');

    try {
      req.user = await this.jwt.verifyAsync<{sub: JwtPayload}>(token);

      return true;
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다');
    }
  }
}
