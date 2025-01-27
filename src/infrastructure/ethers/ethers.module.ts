import { Module } from '@nestjs/common';

import { EnvConfigModule } from '@infrastructure/env-config/env-config.module';

import { EthersService } from './ethers.service';
import { SnatchVeggiesService } from './services/snatch-veggies.service';
import { SnatchVeggiesBankService } from './services/snatch-veggies-bank.service';
import { SnatchVeggiesLandService } from './services/snatch-veggies-land.service';

@Module({
  imports: [EnvConfigModule],
  providers: [
    EthersService,
    SnatchVeggiesService,
    SnatchVeggiesBankService,
    SnatchVeggiesLandService,
  ],
  exports: [
    EthersService,
    SnatchVeggiesService,
    SnatchVeggiesBankService,
    SnatchVeggiesLandService,
  ],
})
export class EthersModule {}
