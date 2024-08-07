import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OnChainClaimModule } from './on-chain-claim/on-chain-claim.module';

@Module({
  imports: [OnChainClaimModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
