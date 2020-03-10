import { transactions, validator as LiskValidator } from 'lisk-sdk';
import fees from '../config/fees';
import BigNum from '@liskhq/bignum';
import { BaseTransaction, StateStorePrepare } from '@liskhq/lisk-transactions';
import {
    AwardFeatTransactionAsset,
    IssuerAccount, PersonAccount,
} from "../../typings/featchain";
import {isIssuerAccount} from "../utils/type-utils";

const { validator, isValidTransferAmount } = LiskValidator;
const {
    TransactionError,
    convertToAssetError,
    utils: {
        verifyAmountBalance,
    }
} = transactions;

export const awardFeatAssetFormatSchema = {
    type: 'object',
    required: ['featTypeId', 'addresses'],
    properties: {
        amount: {
            type: 'string',
            format: 'amount',
        },
        addresses: {
            type: 'array',
            arrayType: 'string',
        }
    }
};

export class AwardFeatTransaction extends BaseTransaction {

    public readonly asset: Readonly<AwardFeatTransactionAsset>;

    static TYPE = 1003;
    static FEE = '0';

    validateAsset(): ReadonlyArray<transactions.TransactionError> {

        const schemaErrors = validator.validate(awardFeatAssetFormatSchema, this.asset);
        const errors = convertToAssetError(this.id, schemaErrors) as transactions.TransactionError[];

        if (!isValidTransferAmount(this.asset.amount)) {
            errors.push(new TransactionError('Amount must be a valid number in string format.', this.id, '.amount', this.asset.amount.toString()));
        }

        const cost = BigInt(this.asset.addresses.length) * BigInt(fees.awardFeat);

        if (this.asset.amount !== cost.toString()) {
            errors.push(new transactions.TransactionError(`You should send ${cost} tokens as part of this transaction`));
        }

        if (this.asset.addresses.length === 0) {
            errors.push(new transactions.TransactionError(`At least one account should be awarded`));
        }

        return errors;
    }

    async prepare(store: StateStorePrepare): Promise<void> {
        await store.account.cache([{
            // @ts-ignore
            address_in: [this.senderId, ...this.asset.addresses],
        }]);
    }

    applyAsset(store: transactions.StateStore): ReadonlyArray<transactions.TransactionError> {
        const errors: transactions.TransactionError[] = [];
        const sender = store.account.get(this.senderId) as IssuerAccount;

        const balanceError = verifyAmountBalance(this.id, sender, new BigNum(this.asset.amount), this.fee);

        if (balanceError) {
            errors.push(balanceError);
        }

        if (!isIssuerAccount(sender)) {
            errors.push(new TransactionError("You must register as an Issuer before awarding a feat"));
            return errors;
        }

        if (!sender.asset.featTypes.hasOwnProperty(this.asset.featTypeId)) {
            errors.push(new TransactionError("FeatType ID not found"));
            return errors;
        }

        sender.asset.featTypes[this.asset.featTypeId].awardCount += BigInt(this.asset.addresses.length);
        sender.balance = new BigNum(sender.balance).sub(this.asset.amount).toString();

        store.account.set(this.senderId, sender);

        this.asset.addresses.forEach(address => {
            const awardReceiver = store.account.get(address) as PersonAccount;

            if (isIssuerAccount(awardReceiver)) {
                errors.push(new TransactionError('Issuers cannot receive awards'));
            }

            if (awardReceiver.asset === undefined) {
                awardReceiver.asset = {
                    awardsReceived: {}
                };
            }

            if(awardReceiver.asset.awardsReceived === undefined) {
                awardReceiver.asset['awardsReceived'] = {};
            }

            awardReceiver.asset.awardsReceived[this.id] = {
                featTypeId: this.asset.featTypeId,
                date: this.asset.date,
                comment: this.asset.comment,
            };

            store.account.set(address, awardReceiver);
        });

        return errors;
    }

    undoAsset(store: transactions.StateStore): ReadonlyArray<transactions.TransactionError> {
        const errors: transactions.TransactionError[] = [];
        const sender = store.account.get(this.senderId) as IssuerAccount;

        sender.balance = new BigNum(sender.balance).add(this.asset.amount).toString();
        sender.asset.featTypes[this.asset.featTypeId].awardCount -= BigInt(this.asset.addresses.length);

        store.account.set(this.senderId, sender);

        this.asset.addresses.forEach(address => {
            const awardReceiver = store.account.get(address) as PersonAccount;
            delete awardReceiver.asset.awardsReceived[this.id];
            store.account.set(address, awardReceiver);
        });

        return errors;
    }
}

