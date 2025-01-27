import SnatchVeggies from '../metadata/SnatchVeggies.json';

import { BadRequestError } from '@domain/errors/bad-request-error';

import { Injectable } from '@nestjs/common';

import { EthersService } from '../ethers.service';
import { EnvConfigService } from '@infrastructure/env-config/env-config.service';

@Injectable()
export class SnatchVeggiesService {
  public constructor(
    private readonly ethersConfig: EthersService,
    private readonly envConfigService: EnvConfigService,
  ) {}

  public async decimals(): Promise<bigint> {
    return await this.ethersConfig
      .contract(this.envConfigService.getSnatchVeggiesContract(), SnatchVeggies.abi)
      .decimals()
      .catch(() => {
        throw new BadRequestError('Error Token ERC20: Internal error.');
      });
  }

  public async balanceOf(account: string): Promise<bigint> {
    return await this.ethersConfig
      .contract(this.envConfigService.getSnatchVeggiesContract(), SnatchVeggies.abi)
      .balanceOf(account)
      .catch(() => {
        throw new BadRequestError('Error Token ERC20: Internal error.');
      });
  }

  public async allowance(owner: string, spender: string): Promise<bigint> {
    return await this.ethersConfig
      .contract(this.envConfigService.getSnatchVeggiesContract(), SnatchVeggies.abi)
      .allowance(owner, spender)
      .catch(() => {
        throw new BadRequestError('Error Token ERC20: Internal error.');
      });
  }

  public async transfer(to: string, amount: bigint): Promise<void> {
    const tx = await this.ethersConfig
      .contract(
        this.envConfigService.getSnatchVeggiesContract(),
        SnatchVeggies.abi,
        this.envConfigService.getMessengerPrivateKey(),
      )
      .transfer(to, amount)
      .catch(() => {
        throw new BadRequestError('Error Token ERC20: Transaction error.');
      });

    await tx.wait();
  }

  public async transferFrom(from: string, to: string, amount: bigint): Promise<void> {
    const tx = await this.ethersConfig
      .contract(
        this.envConfigService.getSnatchVeggiesContract(),
        SnatchVeggies.abi,
        this.envConfigService.getMessengerPrivateKey(),
      )
      .transferFrom(from, to, amount)
      .catch(() => {
        throw new BadRequestError('Error Token ERC20: Transaction error.');
      });

    await tx.wait();
  }
}
