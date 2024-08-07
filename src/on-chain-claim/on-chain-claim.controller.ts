import { Body, Controller, Get } from '@nestjs/common';
import { OnChainClaimService } from './on-chain-claim.service';
import { UpdateStateDto } from './update-state.dto';
import { RepairStreakPaymentDto } from './repair-streak-payment.dto';

@Controller('on-chain-claim')
export class OnChainClaimController {
  constructor(private readonly onChainClaimService: OnChainClaimService) {}

  @Get('/transaction/claim')
  async getClaimTransaction() {
    const transaction = await this.onChainClaimService.getClaimTransaction();
    return transaction.toPlainObject();
  }

  @Get('/transaction/claim-and-repair')
  async getClaimAndRepairTransaction() {
    const transaction =
      await this.onChainClaimService.getClaimAndRepairTransaction();
    return transaction.toPlainObject();
  }

  @Get('/transaction/update-state')
  async getUpdateStateTransaction(@Body() updateStateDto: UpdateStateDto) {
    const transaction =
      await this.onChainClaimService.getUpdateStateTransaction(updateStateDto);
    return transaction.toPlainObject();
  }

  @Get('/transaction/set-repair-streak-payment')
  async getSetRepairStreakPayment(
    @Body() repairStreakPaymentDto: RepairStreakPaymentDto,
  ) {
    const transaction =
      await this.onChainClaimService.getSetRepairStreakPayment(
        repairStreakPaymentDto,
      );
    return transaction.toPlainObject();
  }
}
