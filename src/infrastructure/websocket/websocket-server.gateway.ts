import { ClientPacketTypeEnum } from '@core/enums/packets-type.enum';

import { WsValidationPipe } from '@domain/validators/ws-validation-pipe';

import { WsBadRequestErrorFilter } from '@adapters/ws-error-filter/ws-bad-request-error.filter';
import { WsNotFoundErrorFilter } from '@adapters/ws-error-filter/ws-not-found-error.filter';
import { WsUnauthorizedErrorFilter } from '@adapters/ws-error-filter/ws-unauthorized-error.filter';

import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

import { JwtWsGuard } from '@application/guards/jwt-ws-guard';

import { PlantInventoryController } from '@modules/plant-inventory/adapters/plant-inventory.controller';
import { BlockInventoryController } from '@modules/block-inventory/adapters/block-inventory.controller';
import { StructInventoryController } from '@modules/struct-inventory/adapters/struct-inventory.controller';
import { DecorationInventoryController } from '@modules/decoration-inventory/adapters/decoration-inventory.controller';

import { CreateBlockLandUseCase } from '@modules/land/application/usecases/create-block-land.usecase';
import { CreateStructBlockLandUseCase } from '@modules/land/application/usecases/create-struct-block-land.usecase';
import { CreateDecorationBlockLandUseCase } from '@modules/land/application/usecases/create-decoration-block-land.usecase';
import { CreatePlantBlockLandUseCase } from '@modules/land/application/usecases/create-plant-block-land.usecase';
import { MintStructBlockLandUseCase } from '@modules/land/application/usecases/mint-struct-block-land.usecase';
import { HarvestPlantBlockLandUseCase } from '@modules/land/application/usecases/harvest-plant-block-land.usecase';
import { TheftPlantBlockLandUseCase } from '@modules/land/application/usecases/theft-plant-block-land.usecase';
import { DeleteStructBlockLandUseCase } from '@modules/land/application/usecases/delete-struct-block-land.usecase';
import { DeleteDecorationBlockLandUseCase } from '@modules/land/application/usecases/delete-decoration-block-land.usecase';

import { CreateBlockLandDTO } from '@modules/land/application/dtos/create-block-land.dto';
import { CreateStructBlockLandDTO } from '@modules/land/application/dtos/create-struct-block-land.dto';
import { CreateDecorationBlockLandDTO } from '@modules/land/application/dtos/create-decoration-block-land.dto';
import { CreatePlantBlockLandDTO } from '@modules/land/application/dtos/create-plant-block-land.dto';
import { MintStructBlockLandDTO } from '@modules/land/application/dtos/mint-struct-block-land.dto';
import { HarvestPlantBlockLandDTO } from '@modules/land/application/dtos/harvest-plant-block-land.dto';
import { TheftPlantBlockLandDTO } from '@modules/land/application/dtos/theft-plant-block-land.dto';
import { DeleteStructBlockLandDTO } from '@modules/land/application/dtos/delete-struct-block-land.dto';
import { DeleteDecorationBlockLandDTO } from '@modules/land/application/dtos/delete-decoration-block-land.dto';

import { PlantInventoryPresenter } from '@modules/plant-inventory/adapters/plant-inventory.presenter';
import { BlockInventoryPresenter } from '@modules/block-inventory/adapters/block-inventory.presenter';
import { StructInventoryPresenter } from '@modules/struct-inventory/adapters/struct-inventory.presenter';
import { DecorationInventoryPresenter } from '@modules/decoration-inventory/adapters/decoration-inventory.presenter';

@WebSocketGateway({ cors: { origin: '*' } })
@UseFilters(
  new WsBadRequestErrorFilter(),
  new WsNotFoundErrorFilter(),
  new WsUnauthorizedErrorFilter(),
)
@UsePipes(
  new WsValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class WebSocketServerGateway {
  public constructor(
    private readonly createBlockLandUseCase: CreateBlockLandUseCase.UseCase,
    private readonly createStructBlockLandUseCase: CreateStructBlockLandUseCase.UseCase,
    private readonly createDecorationBlockLandUseCase: CreateDecorationBlockLandUseCase.UseCase,
    private readonly createPlantBlockLandUseCase: CreatePlantBlockLandUseCase.UseCase,
    private readonly mintStructBlockLandUseCase: MintStructBlockLandUseCase.UseCase,
    private readonly harvestPlantBlockLandUseCase: HarvestPlantBlockLandUseCase.UseCase,
    private readonly theftPlantBlockLandUseCase: TheftPlantBlockLandUseCase.UseCase,
    private readonly deleteStructBlockLandUseCase: DeleteStructBlockLandUseCase.UseCase,
    private readonly deleteDecorationBlockLandUseCase: DeleteDecorationBlockLandUseCase.UseCase,
  ) {}

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ClientPacketTypeEnum.CREATE_BLOCK_LAND)
  public async createBlockLand(
    @ConnectedSocket() client: any,
    @MessageBody() data: CreateBlockLandDTO,
  ): Promise<{
    newBlockInventory: BlockInventoryPresenter;
    oldBlockInventory: BlockInventoryPresenter;
  }> {
    const { id } = client.user;
    const output = await this.createBlockLandUseCase.execute({
      userId: id,
      ...data,
    });

    return {
      newBlockInventory: BlockInventoryController.blockInventoryToResponse(
        output.newBlockInventory,
      ),
      oldBlockInventory: BlockInventoryController.blockInventoryToResponse(
        output.oldBlockInventory,
      ),
    };
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ClientPacketTypeEnum.CREATE_STRUCT_BLOCK_LAND)
  public async createStructBlockLand(
    @ConnectedSocket() client: any,
    @MessageBody() data: CreateStructBlockLandDTO,
  ): Promise<StructInventoryPresenter> {
    const { id } = client.user;
    const output = await this.createStructBlockLandUseCase.execute({
      userId: id,
      ...data,
    });
    return StructInventoryController.structInventoryToResponse(output);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ClientPacketTypeEnum.CREATE_DECORATION_BLOCK_LAND)
  public async createDecorationBlockLand(
    @ConnectedSocket() client: any,
    @MessageBody() data: CreateDecorationBlockLandDTO,
  ): Promise<DecorationInventoryPresenter> {
    const { id } = client.user;
    const output = await this.createDecorationBlockLandUseCase.execute({
      userId: id,
      ...data,
    });
    return DecorationInventoryController.decorationInventoryToResponse(output);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ClientPacketTypeEnum.CREATE_PLANT_BLOCK_LAND)
  public async createPlantBlockLand(
    @ConnectedSocket() client: any,
    @MessageBody() data: CreatePlantBlockLandDTO,
  ): Promise<PlantInventoryPresenter> {
    const { id } = client.user;
    const output = await this.createPlantBlockLandUseCase.execute({
      userId: id,
      ...data,
    });
    return PlantInventoryController.plantInventoryToResponse(output);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ClientPacketTypeEnum.MINT_STRUCT_BLOCK_LAND)
  public async mintStructBlockLand(
    @ConnectedSocket() client: any,
    @MessageBody() data: MintStructBlockLandDTO,
  ): Promise<StructInventoryPresenter> {
    const { id } = client.user;
    const output = await this.mintStructBlockLandUseCase.execute({
      userId: id,
      ...data,
    });
    return StructInventoryController.structInventoryToResponse(output);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ClientPacketTypeEnum.HARVEST_PLANT_BLOCK_LAND)
  public async harvestPlantBlockLand(
    @ConnectedSocket() client: any,
    @MessageBody() data: HarvestPlantBlockLandDTO,
  ): Promise<PlantInventoryPresenter> {
    const { id } = client.user;
    const output = await this.harvestPlantBlockLandUseCase.execute({
      userId: id,
      ...data,
    });
    return PlantInventoryController.plantInventoryToResponse(output);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ClientPacketTypeEnum.THEFT_PLANT_BLOCK_LAND)
  public async theftPlantBlockLand(
    @ConnectedSocket() client: any,
    @MessageBody() data: TheftPlantBlockLandDTO,
  ): Promise<PlantInventoryPresenter> {
    const { id } = client.user;
    const output = await this.theftPlantBlockLandUseCase.execute({
      userId: id,
      ...data,
    });
    return PlantInventoryController.plantInventoryToResponse(output);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ClientPacketTypeEnum.DELETE_STRUCT_BLOCK_LAND)
  public async deleteStructBlockLand(
    @ConnectedSocket() client: any,
    @MessageBody() data: DeleteStructBlockLandDTO,
  ): Promise<StructInventoryPresenter> {
    const { id } = client.user;
    const output = await this.deleteStructBlockLandUseCase.execute({
      userId: id,
      ...data,
    });
    return StructInventoryController.structInventoryToResponse(output);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ClientPacketTypeEnum.DELETE_DECORATION_BLOCK_LAND)
  public async deleteDecorationBlockLand(
    @ConnectedSocket() client: any,
    @MessageBody() data: DeleteDecorationBlockLandDTO,
  ): Promise<DecorationInventoryPresenter> {
    const { id } = client.user;
    const output = await this.deleteDecorationBlockLandUseCase.execute({
      userId: id,
      ...data,
    });
    return DecorationInventoryController.decorationInventoryToResponse(output);
  }
}
