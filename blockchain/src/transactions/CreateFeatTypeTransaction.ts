import { validator, isValidTransferAmount } from '@liskhq/lisk-validator';
import fees from '../config/fees';
import BigNum from '@liskhq/bignum';
import { BaseTransaction } from '@liskhq/lisk-transactions';
import * as transactions from '@liskhq/lisk-transactions';
import {CreateFeatTypeTransactionAsset, IssuerAccount} from "../../typings/featchain";
import {isIssuerAccount} from "../utils/type-utils";

const {
    TransactionError,
    convertToAssetError,
    utils: {
        verifyAmountBalance,
    }
} = transactions;

export const createFeatTypeAssetFormatSchema = {
    type: 'object',
    required: ['title'],
    properties: {
        amount: {
            type: 'string',
            format: 'amount',
        },
        title: {
            type: 'string',
            maxLength: 256,
        },
        description: {
            type: 'string',
            maxLength: 2048,
        }
    }
};

export class CreateFeatTypeTransaction extends BaseTransaction {

    public readonly asset: Readonly<CreateFeatTypeTransactionAsset>;

    static TYPE = 1002;
    static FEE = '0';

    validateAsset(): ReadonlyArray<transactions.TransactionError> {

        const schemaErrors = validator.validate(createFeatTypeAssetFormatSchema, this.asset);
        const errors = convertToAssetError(this.id, schemaErrors) as transactions.TransactionError[];

        if (!isValidTransferAmount(this.asset.amount.toString())) {
            errors.push(new TransactionError('Amount must be a valid number in string format.', this.id, '.amount', this.asset.amount.toString()));
        }

        if (this.asset.amount !== fees.createFeatType) {
            errors.push(new transactions.TransactionError(`You should send ${fees.createFeatType} beddows as part of this transaction`));
        }

        return errors;
    }

    async prepare(store: transactions.StateStorePrepare): Promise<void> {
        await store.account.cache([
            {
                address: this.senderId,
            },
        ]);
    }

    applyAsset(store: transactions.StateStore): ReadonlyArray<transactions.TransactionError> {
        const errors: transactions.TransactionError[] = [];
        const sender = store.account.get(this.senderId) as IssuerAccount;

        const balanceError = verifyAmountBalance(this.id, sender, new BigNum(this.asset.amount.toString()), this.fee);

        if (balanceError) {
            errors.push(balanceError);
        }

        if (!isIssuerAccount(sender)) {
            errors.push(new TransactionError("You must register as an Issuer before registering a FeatType"));
            return errors;
        }

        if (sender.asset.featTypes.hasOwnProperty(this.id)) {
            errors.push(new TransactionError("FeatType ID is already registered"));
        }

        sender.asset.featTypes[this.id] = {
            id: this.id,
            title: this.asset.title,
            description: this.asset.description,
            awardCount: BigInt(0),
        };

        sender.balance = new BigNum(sender.balance).sub(this.asset.amount.toString()).toString();

        store.account.set(this.senderId, sender);

        return errors;
    }

    undoAsset(store: transactions.StateStore): ReadonlyArray<transactions.TransactionError> {
        const errors: transactions.TransactionError[] = [];
        const sender = store.account.get(this.senderId) as IssuerAccount;

        // Always true, used as type guard
        if (isIssuerAccount(sender)) {
            delete sender.asset.featTypes[this.id];
            sender.balance = new BigNum(sender.balance).add(this.asset.amount.toString()).toString();

            store.account.set(this.senderId, sender);
        }

        return errors;
    }
}

