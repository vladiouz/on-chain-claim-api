import { Module } from '@nestjs/common';
import { OnChainClaimController } from './on-chain-claim.controller';
import { OnChainClaimService } from './on-chain-claim.service';

@Module({
  controllers: [OnChainClaimController],
  providers: [OnChainClaimService]
})
export class OnChainClaimModule {}
