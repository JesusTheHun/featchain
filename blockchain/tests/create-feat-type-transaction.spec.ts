import { CreateFeatTypeTransaction } from '../src/transactions/CreateFeatTypeTransaction';
import {CreateFeatTypeTransactionAsset, IssuerAccount, IssuerAsset, PersonAccount} from "../typings/featchain";

import { utils } from '@liskhq/lisk-transactions';
import { when } from 'jest-when';

describe('CreateFeatTypeTransaction', () => {
    let storeStub;
    beforeEach(() => {
        storeStub = {
            account: {
                get: jest.fn(),
                set: jest.fn(),
            },
        };
    });

    test('it should apply the state to register the feat type into the issuer\'s assets', async () => {
        // Arrange
        const senderId = '16313739661670634666L';
        const senderPublicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
        const asset: CreateFeatTypeTransactionAsset = {
            title: "You've been a good boy",
            description: "Here is a sugar",
            amount: utils.convertLSKToBeddows('50'),
        };

        const mockedSenderAccount: IssuerAccount = {
            address: senderId,
            balance: utils.convertLSKToBeddows('10000'),
            asset: {
                title: "DappIT",
                description: "A distributed and decentralized software company",
                authorityUrl: "http://dappit.fr",
                featTypes: {},
            }
        };

        when(storeStub.account.get)
            .calledWith(senderId)
            .mockReturnValue(mockedSenderAccount);

        // Act
        const tx = new CreateFeatTypeTransaction({
            id: "foo",
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
            featTypes: {
                ['foo']: {
                    id: "foo",
                    title: "You've been a good boy",
                    description: "Here is a sugar",
                    awardCount: BigInt(0)
                }
            },
        };

        // Assert
        expect(storeStub.account.set).toHaveBeenNthCalledWith(
            1,
            mockedSenderAccount.address,
            {
                address: mockedSenderAccount.address,
                balance: utils.convertLSKToBeddows('9950'),
                asset: expectedAsset
            }
        );
    });

    test('it should FAIL to apply the state to register the feat type into the non-issuer asset', async () => {
        // Arrange
        const senderId = '16313739661670634666L';
        const senderPublicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
        const asset: CreateFeatTypeTransactionAsset = {
            title: "You've been a good boy",
            description: "Here is a sugar",
            amount: utils.convertLSKToBeddows('50'),
        };

        const mockedSenderAccount: PersonAccount = {
            address: senderId,
            balance: utils.convertLSKToBeddows('10000'),
            asset: undefined
        };

        when(storeStub.account.get)
            .calledWith(senderId)
            .mockReturnValue(mockedSenderAccount);

        // Act
        const tx = new CreateFeatTypeTransaction({
            id: "foo",
            senderId,
            senderPublicKey,
            asset,
        });

        const errors = tx.applyAsset(storeStub);

        expect(errors).toHaveLength(1);
    });

    test('it should undo the state to remove the feat type from the issuer\'s assets', async () => {
        // Arrange
        const senderId = '16313739661670634666L';
        const senderPublicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
        const asset: CreateFeatTypeTransactionAsset = {
            title: "You've been a good boy",
            description: "Here is a sugar",
            amount: utils.convertLSKToBeddows('50'),
        };

        const mockedSenderAccount = {
            address: senderId,
            balance: utils.convertLSKToBeddows('9950'),
            asset: {
                title: "DappIT",
                description: "A distributed and decentralized software company",
                authorityUrl: "http://dappit.fr",
                featTypes: {
                    ['foo']: {
                        id: "foo",
                        title: "You've been a good boy",
                        description: "Here is a sugar",
                        awardCount: BigInt(0)
                    }
                },
            }
        };

        when(storeStub.account.get)
            .calledWith(senderId)
            .mockReturnValue(mockedSenderAccount);

        // Act
        const tx = new CreateFeatTypeTransaction({
            id: "foo",
            senderId,
            senderPublicKey,
            asset,
        });

        tx.undoAsset(storeStub);

        const expectedAsset: IssuerAsset = {
            title: "DappIT",
            description: "A distributed and decentralized software company",
            authorityUrl: "http://dappit.fr",
            featTypes: {},
        };

        // Assert
        expect(storeStub.account.set).toHaveBeenNthCalledWith(
            1,
            mockedSenderAccount.address,
            {
                address: mockedSenderAccount.address,
                balance: utils.convertLSKToBeddows('10000'),
                asset: expectedAsset
            }
        );
    });
});
