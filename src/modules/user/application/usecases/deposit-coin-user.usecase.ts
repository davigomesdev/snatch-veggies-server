import { parseUnits } from 'ethers';

import { BadRequestError } from '@domain/errors/bad-request-error';

import { EnvConfigService } from '@infrastructure/env-config/env-config.service';
import { SnatchVeggiesService } from '@infrastructure/ethers/services/snatch-veggies.service';
import { SnatchVeggiesBankService } from '@infrastructure/ethers/services/snatch-veggies-bank.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { UserRepository } from '@modules/user/domain/user.repository';

export namespace DepositCoinUserUseCase {
  export type Input = {
    id: string;
    amount: number;
  };

  export type Output = void;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly userRepository: UserRepository.Repository,
      private readonly snatchVeggiesService: SnatchVeggiesService,
      private readonly snatchVeggiesBankService: SnatchVeggiesBankService,
      private readonly envConfigService: EnvConfigService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { id, amount } = input;

      const user = await this.userRepository.find({ id });
      const messenger = this.envConfigService.getMessengerAddress();

      const decimals = await this.snatchVeggiesService.decimals();
      const balance = await this.snatchVeggiesService.balanceOf(user.address);
      const allowance = await this.snatchVeggiesService.allowance(user.address, messenger);

      const feeEther = await this.snatchVeggiesBankService.fee();
      const allowanceEther = await this.snatchVeggiesBankService.allowances(user.address);

      const tokenAmount = parseUnits(String(amount), Number(decimals));

      if (feeEther > allowanceEther) {
        throw new BadRequestError('Pending tax payment.');
      }

      if (tokenAmount > balance) {
        throw new BadRequestError('Insufficient token amount.');
      }

      if (tokenAmount > allowance) {
        throw new BadRequestError('Transaction not approved by the user.');
      }

      await this.snatchVeggiesBankService.take(user.address, feeEther);
      await this.snatchVeggiesService.transferFrom(user.address, messenger, tokenAmount);

      user.updateGold(user.gold + amount);
      await this.userRepository.update(user);
    }
  }
}
