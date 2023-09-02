import { Body, Controller, Get, Post, Res, Session } from '@nestjs/common';
import { generateNonce, SiweMessage, SiweErrorType } from 'siwe';
import { Response } from 'express';
import { RedisService } from 'src/redis/redis.service';
import { VerifyDto } from 'src/redis/dto';

@Controller('siwe')
export class SiweController {
  constructor(private readonly redisService: RedisService) {}

  @Get('/nonce')
  getNonce(
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ): void {
    session.nonce = generateNonce();
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(session.nonce);
  }

  @Post('/verify')
  async verify(
    @Body() verifyDto: VerifyDto,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ): Promise<undefined> {
    if (await this.redisService.userExists(verifyDto.userAddress)) {
      res.json({
        status: 'exists',
        message: 'You are already registered.',
      });
    }
    try {
      const SIWEObject = new SiweMessage(verifyDto.message);
      const { data: message } = await SIWEObject.verify({
        signature: verifyDto.signature,
        nonce: session.nonce,
      });
      session.cookie.expires = new Date(message.expirationTime ?? -1);

      await this.redisService.registerUser(verifyDto.userAddress);

      session.save(() =>
        res.status(200).json({
          status: 'success',
          message: 'Welcome to Fluffe!',
        }),
      );
    } catch (e) {
      session.siwe = null;
      session.nonce = null;
      console.error(e);

      const responseBody = { status: 'failed', message: e.message };

      switch (e) {
        case SiweErrorType.EXPIRED_MESSAGE: {
          session.save(() => res.status(440).json(responseBody));
          break;
        }
        case SiweErrorType.INVALID_SIGNATURE: {
          session.save(() => res.status(422).json(responseBody));
          break;
        }
        default: {
          session.save(() => res.status(500).json(responseBody));
          break;
        }
      }
    }
  }

  @Get('/me')
  async getMe(@Res() res: Response, @Session() session: Record<string, any>) {
    if (!session.siwe) {
      return res.status(401).json({
        authenticated: false,
        address: null,
        message: 'You have to first sign_in',
      });
    }

    return res.json({
      authenticated: true,
      address: session.siwe.address,
      message: null,
    });
  }
}
