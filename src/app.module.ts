import { Module } from '@nestjs/common';
import { OnChainClaimModule } from './on-chain-claim/on-chain-claim.module';

@Module({
  imports: [OnChainClaimModule],
})
export class AppModule {}
