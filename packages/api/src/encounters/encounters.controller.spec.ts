import { Test, TestingModule } from '@nestjs/testing';
import { EncountersController } from './encounters.controller';

describe('EncountersController', () => {
  let controller: EncountersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EncountersController],
    }).compile();

    controller = module.get<EncountersController>(EncountersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
