import { JsonRpcProvider, Contract, Wallet } from 'ethers';

import { Injectable } from '@nestjs/common';

import { EnvConfigService } from '@infrastructure/env-config/env-config.service';

@Injectable()
export class EthersService {
  public constructor(private readonly envConfigService: EnvConfigService) {}

  public contract(address: string, abi: any, messenger?: string): Contract {
    const provider = new JsonRpcProvider(this.envConfigService.getMatchRpcUrl());
    const wallet = messenger ? new Wallet(messenger, provider) : null;
    const contract = new Contract(address, abi, wallet ?? provider);

    return contract;
  }
}
