import SnatchVeggiesBank from '../metadata/SnatchVeggiesBank.json';

import { BadRequestError } from '@domain/errors/bad-request-error';

import { Injectable } from '@nestjs/common';

import { EthersService } from '../ethers.service';
import { EnvConfigService } from '@infrastructure/env-config/env-config.service';

@Injectable()
export class SnatchVeggiesBankService {
  public constructor(
    private readonly ethersConfig: EthersService,
    private readonly envConfigService: EnvConfigService,
  ) {}

  public async fee(): Promise<bigint> {
    return await this.ethersConfig
      .contract(this.envConfigService.getSnatchVeggiesBankContract(), SnatchVeggiesBank.abi)
      .fee()
      .catch(() => {
        throw new BadRequestError('Error SnatchVeggiesBank: Internal error.');
      });
  }

  public async allowances(owner: string): Promise<bigint> {
    return await this.ethersConfig
      .contract(this.envConfigService.getSnatchVeggiesBankContract(), SnatchVeggiesBank.abi)
      .allowances(owner)
      .catch(() => {
        throw new BadRequestError('Error SnatchVeggiesBank: Internal error.');
      });
  }

  public async take(from: string, amount: bigint): Promise<void> {
    const tx = await this.ethersConfig
      .contract(
        this.envConfigService.getSnatchVeggiesBankContract(),
        SnatchVeggiesBank.abi,
        this.envConfigService.getMessengerPrivateKey(),
      )
      .take(from, amount)
      .catch(() => {
        throw new BadRequestError('Error SnatchVeggiesBank: Transaction error.');
      });

    return tx.wait();
  }
}
