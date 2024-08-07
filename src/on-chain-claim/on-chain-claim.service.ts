import {
  AbiRegistry,
  Address,
  AddressValue,
  ResultsParser,
  SmartContract,
  TokenIdentifierValue,
  Transaction,
  U64Value,
} from '@multiversx/sdk-core/out';
import { Injectable } from '@nestjs/common';
import { promises } from 'fs';
import { CommonService } from 'src/common.service';
import { sc_address } from 'src/utils';
import { UpdateStateDto } from './update-state.dto';
import { RepairStreakPaymentDto } from './repair-streak-payment.dto';
import { AddressInfoDto } from './address-info.dto';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { EsdtTokenPaymentDto } from './esdt-token-payment.dto';

@Injectable()
export class OnChainClaimService {
  constructor(private readonly commonService: CommonService) {}

  async getSmartContract(address: string): Promise<SmartContract> {
    const jsonContent: string = await promises.readFile(
      'src/on-chain-claim.abi.json',
      {
        encoding: 'utf8',
      },
    );
    const json = JSON.parse(jsonContent);
    const contract = new SmartContract({
      address: Address.fromBech32(address),
      abi: AbiRegistry.create(json),
    });

    return contract;
  }

  async getClaimTransaction(): Promise<Transaction> {
    const contract = await this.getSmartContract(sc_address);
    const interactor = contract.methodsExplicit.claim();
    const transaction = interactor.buildTransaction();

    return transaction;
  }

  async getClaimAndRepairTransaction(): Promise<Transaction> {
    const contract = await this.getSmartContract(sc_address);
    const interactor = contract.methodsExplicit.claimAndRepair();
    const transaction = interactor.buildTransaction();

    return transaction;
  }

  async getUpdateStateTransaction(
    updateStateDto: UpdateStateDto,
  ): Promise<Transaction> {
    const contract = await this.getSmartContract(sc_address);
    const args = [
      new AddressValue(Address.fromBech32(updateStateDto.address)),
      new U64Value(updateStateDto.current_streak),
      new U64Value(updateStateDto.last_epoch_claimed),
      new U64Value(updateStateDto.total_epochs_claimed),
      new U64Value(updateStateDto.best_streak),
    ];
    const interactor = contract.methodsExplicit.updateState(args);
    const transaction = interactor.buildTransaction();

    return transaction;
  }

  async getSetRepairStreakPayment(
    repairStreakPaymentDto: RepairStreakPaymentDto,
  ): Promise<Transaction> {
    const contract = await this.getSmartContract(sc_address);
    const args = [
      new TokenIdentifierValue(repairStreakPaymentDto.tokenId),
      new U64Value(repairStreakPaymentDto.amount),
    ];
    const interactor = contract.methodsExplicit.setRepairStreakPayment(args);
    const transaction = interactor.buildTransaction();

    return transaction;
  }

  async getAddressInfo(address: string): Promise<AddressInfoDto> {
    const provider = await this.commonService.getNetworkProvider();
    const contract = await this.getSmartContract(sc_address);
    const interactor = contract.methodsExplicit.getAddressInfo([
      new AddressValue(Address.fromBech32(address)),
    ]);
    const queryResult = await provider.queryContract(interactor.buildQuery());
    const endpointDefinition = interactor.getEndpoint();
    const result = new ResultsParser().parseQueryResponse(
      queryResult,
      endpointDefinition,
    );

    return result.firstValue.valueOf();
  }

  async getCanBeRepaired(address: string): Promise<boolean> {
    const provider = await this.commonService.getNetworkProvider();
    const contract = await this.getSmartContract(sc_address);
    const interactor = contract.methodsExplicit.canBeRepaired([
      new AddressValue(Address.fromBech32(address)),
    ]);
    const queryResult = await provider.queryContract(interactor.buildQuery());
    const endpointDefinition = interactor.getEndpoint();
    const result = new ResultsParser().parseQueryResponse(
      queryResult,
      endpointDefinition,
    );

    return result.firstValue.valueOf();
  }

  async getRepairStreakPayment(): Promise<EsdtTokenPaymentDto> {
    const provider = await this.commonService.getNetworkProvider();
    const contract = await this.getSmartContract(sc_address);
    const interactor = contract.methodsExplicit.getRepairStreakPayment();
    const queryResult = await provider.queryContract(interactor.buildQuery());
    const endpointDefinition = interactor.getEndpoint();
    const result = new ResultsParser().parseQueryResponse(
      queryResult,
      endpointDefinition,
    );

    return result.firstValue.valueOf();
  }
}
