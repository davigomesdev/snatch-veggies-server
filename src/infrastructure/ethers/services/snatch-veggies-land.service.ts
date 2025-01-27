import SnatchVeggiesLand from '../metadata/SnatchVeggiesLand.json';

import { BadRequestError } from '@domain/errors/bad-request-error';

import { Injectable } from '@nestjs/common';

import { EthersService } from '../ethers.service';
import { EnvConfigService } from '@infrastructure/env-config/env-config.service';

@Injectable()
export class SnatchVeggiesLandService {
  public constructor(
    private readonly ethersConfig: EthersService,
    private readonly envConfigService: EnvConfigService,
  ) {}

  public async listTokenIdsByOwner(owner: string): Promise<bigint[]> {
    return await this.ethersConfig
      .contract(this.envConfigService.getSnatchVeggiesLandContract(), SnatchVeggiesLand.abi)
      .listTokenIdsByOwner(owner)
      .catch(() => {
        throw new BadRequestError('Error SnatchVeggiesLand: Internal error.');
      });
  }
}
