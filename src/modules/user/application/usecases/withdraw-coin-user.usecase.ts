import { parseUnits } from 'ethers';

import { BadRequestError } from '@domain/errors/bad-request-error';

import { SnatchVeggiesService } from '@infrastructure/ethers/services/snatch-veggies.service';
import { SnatchVeggiesBankService } from '@infrastructure/ethers/services/snatch-veggies-bank.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { UserRepository } from '@modules/user/domain/user.repository';

export namespace WithdrawCoinUserUseCase {
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
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { id, amount } = input;

      const user = await this.userRepository.find({ id });

      if (amount > user.gold) {
        throw new BadRequestError('Insufficient token amount.');
      }

      const feeEther = await this.snatchVeggiesBankService.fee();
      const allowanceEther = await this.snatchVeggiesBankService.allowances(user.address);

      if (feeEther > allowanceEther) {
        throw new BadRequestError('Pending tax payment.');
      }

      user.updateGold(user.gold - amount);

      const decimals = await this.snatchVeggiesService.decimals();
      const tokenAmount = parseUnits(String(amount), Number(decimals));

      await this.snatchVeggiesBankService.take(user.address, feeEther);
      await this.snatchVeggiesService.transfer(user.address, tokenAmount);

      await this.userRepository.update(user);
    }
  }
}
