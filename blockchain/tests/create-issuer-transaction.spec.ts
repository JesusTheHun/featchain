import { CreateIssuerTransaction } from '../src/transactions';
import {CreateIssuerTransactionAsset, IssuerAsset} from "../typings/featchain";

import { utils } from '@liskhq/lisk-transactions';
import { when } from 'jest-when';

describe('CreateIssuerTransaction', () => {
    let storeStub;
    beforeEach(() => {
        storeStub = {
            account: {
                get: jest.fn(),
                set: jest.fn(),
            },
        };
    });

    test('it should apply the state to turn the account into an issuer', async () => {
        // Arrange
        const senderId = '16313739661670634666L';
        const senderPublicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
        const asset: CreateIssuerTransactionAsset = {
            title: "DappIT",
            description: "A distributed and decentralized software company",
            authorityUrl: "http://dappit.fr",
            amount: utils.convertLSKToBeddows('5000'),
        };

        const mockedSenderAccount = {
            address: senderId,
            balance: utils.convertLSKToBeddows('10000'),
        };

        when(storeStub.account.get)
            .calledWith(senderId)
            .mockReturnValue(mockedSenderAccount);

        // Act
        const tx = new CreateIssuerTransaction({
            senderId,
            senderPublicKey,
            asset,
        });

        const validationErrors = tx.validateAsset();
        expect(validationErrors).toHaveLength(0);

        tx.applyAsset(storeStub);

        const expectedAsset: IssuerAsset = {
            title: "DappIT",
            description: "A distributed and decentralized software company",
            authorityUrl: "http://dappit.fr",
            featTypes: {},
        };

        // Assert
        expect(storeStub.account.set.mock.calls[0][0]).toEqual(mockedSenderAccount.address);
        expect(storeStub.account.set.mock.calls[0][1]).toEqual({
            address: mockedSenderAccount.address,
            balance: utils.convertLSKToBeddows('5000'),
            asset: expectedAsset
        });
    });

    test('it should FAIL to apply the state to turn the account into an issuer - invalid amount', async () => {
        // Arrange
        const senderId = '16313739661670634666L';
        const senderPublicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
        const asset: CreateIssuerTransactionAsset = {
            title: "DappIT",
            description: "A distributed and decentralized software company",
            authorityUrl: "http://dappit.fr",
            amount: utils.convertLSKToBeddows('42'),
        };

        const mockedSenderAccount = {
            address: senderId,
            balance: utils.convertLSKToBeddows('10000'),
        };

        when(storeStub.account.get)
            .calledWith(senderId)
            .mockReturnValue(mockedSenderAccount);

        // Act
        const tx = new CreateIssuerTransaction({
            senderId,
            senderPublicKey,
            asset,
        });

        const validationErrors = tx.validateAsset();
        expect(validationErrors).toHaveLength(1);
    });

    test('it should FAIL to apply the state to turn the account into an issuer - insufficient funds', async () => {
        // Arrange
        const senderId = '16313739661670634666L';
        const senderPublicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
        const asset: CreateIssuerTransactionAsset = {
            title: "DappIT",
            description: "A distributed and decentralized software company",
            authorityUrl: "http://dappit.fr",
            amount: utils.convertLSKToBeddows('5000'),
        };

        const mockedSenderAccount = {
            address: senderId,
            balance: utils.convertLSKToBeddows('1'),
        };

        when(storeStub.account.get)
            .calledWith(senderId)
            .mockReturnValue(mockedSenderAccount);

        // Act
        const tx = new CreateIssuerTransaction({
            senderId,
            senderPublicKey,
            asset,
        });

        const validationErrors = tx.validateAsset();
        expect(validationErrors).toHaveLength(0);

        const errors = tx.applyAsset(storeStub);
        expect(errors).toHaveLength(1);
    });

    test('it should undo the state to turn the account into a person account', async () => {
        // Arrange
        const senderId = '16313739661670634666L';
        const senderPublicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
        const asset: CreateIssuerTransactionAsset = {
            title: "DappIT",
            description: "A distributed and decentralized software company",
            authorityUrl: "http://dappit.fr",
            amount: utils.convertLSKToBeddows('5000'),
        };

        const mockedSenderAccount = {
            address: senderId,
            balance: utils.convertLSKToBeddows('5000'),
        };

        when(storeStub.account.get)
            .calledWith(senderId)
            .mockReturnValue(mockedSenderAccount);

        // Act
        const tx = new CreateIssuerTransaction({
            senderId,
            senderPublicKey,
            asset,
        });

        tx.undoAsset(storeStub);

        const expectedAsset: IssuerAsset = undefined;

        // Assert
        expect(storeStub.account.set.mock.calls[0][0]).toEqual(mockedSenderAccount.address);
        expect(storeStub.account.set.mock.calls[0][1]).toEqual({
            address: mockedSenderAccount.address,
            balance: utils.convertLSKToBeddows('10000'),
            asset: expectedAsset
        });
    });
});
