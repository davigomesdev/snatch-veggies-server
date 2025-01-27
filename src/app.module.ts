import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfigModule } from '@infrastructure/env-config/env-config.module';
import { WebSocketServerModule } from '@infrastructure/websocket/websocket-server.module';

import { AuthModule } from '@modules/auth/adapters/auth.module';
import { UserModule } from '@modules/user/adapters/user.module';
import { LandModule } from '@modules/land/adapters/land.module';
import { BlockModule } from '@modules/block/adapters/block.module';
import { StructModule } from '@modules/struct/adapters/struct.module';
import { PlantModule } from '@modules/plant/adapters/plant.module';
import { DecorationModule } from '@modules/decoration/adapters/decoration.module';
import { FishModule } from '@modules/fish/adapters/fish.module';
import { BlockInventoryModule } from '@modules/block-inventory/adapters/block-inventory.module';
import { StructInventoryModule } from '@modules/struct-inventory/adapters/struct-inventory.module';
import { DecorationInventoryModule } from '@modules/decoration-inventory/adapters/decoration-inventory.module';
import { PlantInventoryModule } from '@modules/plant-inventory/adapters/plant-inventory.module';
import { FishInventoryModule } from '@modules/fish-inventory/adapters/fish-inventory.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    WebSocketServerModule,
    EnvConfigModule,
    AuthModule,
    UserModule,
    LandModule,
    BlockModule,
    StructModule,
    DecorationModule,
    PlantModule,
    FishModule,
    BlockInventoryModule,
    StructInventoryModule,
    DecorationInventoryModule,
    PlantInventoryModule,
    FishInventoryModule,
  ],
})
export class AppModule {}
