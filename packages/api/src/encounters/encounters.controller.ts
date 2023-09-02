import { Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { RedisService } from 'src/redis/redis.service';

type EncounterGameResponse = {
  status: string;
  answer: string;
  correctAnswer?: string;
};

@Controller('encounters')
export class EncountersController {
  constructor(private readonly redisService: RedisService) {}

  createResponseBody(game: string[]): EncounterGameResponse {
    const [status, answer, correctAnswer] = game;
    const responseBody: EncounterGameResponse = {
      status,
      answer,
    };

    if (answer) {
      responseBody.correctAnswer = correctAnswer;
    }

    return responseBody;
  }

  @Get('/game/:encounterId')
  async getEncounterGame(
    @Res() res: Response,
    @Param('encounterId') encounterId: string,
  ) {
    const exists = await this.redisService.encounterGameExists(encounterId);

    if (!exists) {
      return res.status(404).json({
        message: 'Game not found.',
        data: undefined,
      });
    }

    const game = await this.redisService.getEncounterGame(encounterId);

    if (game.length) {
      return res.json({
        message: undefined,
        data: this.createResponseBody(game),
      });
    }
  }

  @Post('/game/:encounterId/:answerIndex')
  async submitGameResult(
    @Res() res: Response,
    @Param('encounterId') encounterId: string,
    @Param('answerIndex') answerIndex: string,
  ) {
    try {
      const game = await this.redisService.getEncounterGame(encounterId);

      const [_, answer] = game;
      if (answer) {
        throw new Error('Re-submissions are not allowed.');
      }

      if (game)
        await this.redisService.submitEncounterGameAnswer(
          encounterId,
          answerIndex,
        );

      return res.json({
        message: 'Successfully submitted answer.',
        data: this.createResponseBody(game),
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  }
}
