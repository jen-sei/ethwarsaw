import { Body, Controller, Get, Post, Req, Res, Session } from '@nestjs/common';
import { generateNonce, SiweMessage, SiweErrorType } from 'siwe';
import { Request, Response } from 'express';
import { RedisService } from 'src/redis/redis.service';
import { VerifyDto } from 'src/redis/dto';

@Controller('siwe')
export class SiweController {
  constructor(private readonly redisService: RedisService) {}

  @Get('/nonce')
  getNonce(@Res() res: Response, @Req() req: Request): void {
    req.session.nonce = generateNonce();
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(req.session.nonce);
  }

  @Post('/verify')
  async verify(
    @Body() verifyDto: VerifyDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    try {
      if (!req.body.message && !req.session.nonce) {
        res
          .status(422)
          .json({ message: 'Expected prepareMessage object as body.' });
        return;
      }

      const SIWEObject = new SiweMessage(req.body.message);
      const { data: message } = await SIWEObject.verify({
        signature: req.body.signature,
        nonce: req.session.nonce,
      });

      req.session.siwe = message;
      req.session.cookie.maxAge = message.expirationTime
        ? parseInt(message.expirationTime)
        : undefined;

      await this.redisService.registerUser(verifyDto.userAddress);

      req.session.save(() => res.status(200).send(true));
    } catch (e) {
      req.session.siwe = undefined;
      req.session.nonce = undefined;
      console.error(e);
      switch (e) {
        case SiweErrorType.EXPIRED_MESSAGE: {
          req.session.save(() => res.status(440).json({ message: e.message }));
          break;
        }
        case SiweErrorType.INVALID_SIGNATURE: {
          req.session.save(() => res.status(422).json({ message: e.message }));
          break;
        }
        default: {
          req.session.save(() => res.status(500).json({ message: e.message }));
          break;
        }
      }
    }
  }

  @Get('/me')
  async getMe(@Res() res: Response, @Req() req: Request) {
    if (!req.session.siwe || !req.session.siwe.address) {
      return res.status(401).json({
        authenticated: false,
        address: null,
        message: 'You have to first sign_in',
      });
    }

    const chatSecret = await this.redisService.getUserChatSecret(
      req.session.siwe.address,
    );

    return res.json({
      authenticated: true,
      address: req.session.siwe.address,
      chatSecret,
      message: null,
    });
  }
}
