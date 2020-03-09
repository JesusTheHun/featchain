import { transactions, validator as LiskValidator } from 'lisk-sdk';
import fees from '../config/fees';
import BigNum from '@liskhq/bignum';
import { BaseTransaction } from '@liskhq/lisk-transactions';
import {CreateIssuerTransactionAsset, IssuerAccount, IssuerAsset} from "../../typings/featchain";

const { validator, isValidTransferAmount } = LiskValidator;
const {
    TransactionError,
    convertToAssetError,
    utils: {
        verifyAmountBalance,
    }
} = transactions;

export const createIssuerAssetFormatSchema = {
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

export class CreateIssuerTransaction extends BaseTransaction {

    public readonly asset: CreateIssuerTransactionAsset;

    static TYPE = 1001;
    static FEE = '0';

    protected validateAsset(): ReadonlyArray<transactions.TransactionError> {

        const schemaErrors = validator.validate(createIssuerAssetFormatSchema, this.asset);
        const errors = convertToAssetError(
            this.id,
            schemaErrors,
        ) as transactions.TransactionError[];

        if (!isValidTransferAmount(this.asset.amount.toString())) {
            errors.push(
                new TransactionError(
                    'Amount must be a valid number in string format.',
                    this.id,
                    '.amount',
                    this.asset.amount.toString(),
                ),
            );
        }

        if (this.asset.amount !== BigInt(fees.createIssuer)) {
            errors.push(new transactions.TransactionError);
        }

        return errors;
    }

    public async prepare(store: transactions.StateStorePrepare): Promise<void> {
        await store.account.cache([
            {
                address: this.senderId,
            },
        ]);
    }

    protected applyAsset(store: transactions.StateStore): ReadonlyArray<transactions.TransactionError> {
        const errors: transactions.TransactionError[] = [];
        const sender = store.account.get(this.senderId) as IssuerAccount;

        const balanceError = verifyAmountBalance(
            this.id,
            sender,
            new BigNum(this.asset.amount.toString()),
            this.fee,
        );
        if (balanceError) {
            errors.push(balanceError);
        }

        sender.asset = {
            title: this.asset.title,
            description: this.asset.description,
            authorityUrl: this.asset.authorityUrl,
            featTypes: {},
        } as IssuerAsset;

        sender.balance = new BigNum(sender.balance).sub(this.asset.amount.toString()).toString();

        store.account.set(this.senderId, sender);

        return errors;
    }

    undoAsset(store: transactions.StateStore): ReadonlyArray<transactions.TransactionError> {
        const errors: transactions.TransactionError[] = [];
        const sender = store.account.get(this.senderId) as IssuerAccount;

        sender.asset = {};
        sender.balance = new BigNum(sender.balance).add(this.asset.amount.toString()).toString();

        store.account.set(this.senderId, sender);

        return errors;
    }
}

