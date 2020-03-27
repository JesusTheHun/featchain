import { AwardFeatTransaction } from '../src/transactions';
import {AwardFeatTransactionAsset, IssuerAccount, PersonAccount} from "../typings/featchain";

import { utils } from '@liskhq/lisk-transactions';
import { when } from 'jest-when';

describe('AwardFeatTransaction', () => {
    let storeStub;
    beforeEach(() => {
        storeStub = {
            account: {
                get: jest.fn(),
                set: jest.fn(),
            },
        };
    });

    test('it should apply the state to add the award to the persons account', async () => {
        // Arrange
        const senderId = '16313739661670634666L';
        const senderPublicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
        const asset: AwardFeatTransactionAsset = {
            featTypeId: 'someFeatType',
            addresses: ['a', 'b'],
            comment: "Wassup dawg ?",
            date: 1337,
            amount: utils.convertLSKToBeddows('20'),
        };

        const mockedSenderAccount: Partial<IssuerAccount> = {
            address: senderId,
            balance: utils.convertLSKToBeddows('10000'),
            asset: {
                title: "DappIT",
                description: "A distributed and decentralized software company",
                authorityUrl: "http://dappit.fr",
                featTypes: {
                    "someFeatType": {
                        id: "someFeatType",
                        title: "You've been a good boy",
                        description: "Here is a sugar",
                        awardCount: '0'
                    }
                }
            }
        };

        const mockedAwardAccount1 = {
            address: 'a',
            balance: utils.convertLSKToBeddows('0'),
        };

        const mockedAwardAccount2 = {
            address: 'b',
            balance: utils.convertLSKToBeddows('0'),
        };

        when(storeStub.account.get)
            .calledWith(senderId)
            .mockReturnValue(mockedSenderAccount);

        when(storeStub.account.get)
            .calledWith(mockedAwardAccount1.address)
            .mockReturnValue(mockedAwardAccount1);

        when(storeStub.account.get)
            .calledWith(mockedAwardAccount2.address)
            .mockReturnValue(mockedAwardAccount2);

        // Act
        const tx = new AwardFeatTransaction({
            id: "foo",
            senderId,
            senderPublicKey,
            asset,
        });

        const validationErrors = tx.validateAsset();
        expect(validationErrors).toHaveLength(0);

        tx.applyAsset(storeStub);

        const expectedSenderAccount = {
            ...mockedSenderAccount,
            balance: utils.convertLSKToBeddows('9980'),
        };

        expectedSenderAccount.asset.featTypes.someFeatType.awardCount = '2';

        const expectedAccount1: Partial<PersonAccount> = {
            ...mockedAwardAccount1,
            asset: {
                awardsReceived: {
                    [tx.id]: {
                        featTypeId: 'someFeatType',
                        comment: "Wassup dawg ?",
                        date: 1337,
                    }
                }
            }
        };

        const expectedAccount2: Partial<PersonAccount> = {
            ...mockedAwardAccount2,
            asset: {
                awardsReceived: {
                    [tx.id]: {
                        featTypeId: 'someFeatType',
                        comment: "Wassup dawg ?",
                        date: 1337,
                    }
                }
            }
        };

        // Assert
        expect(storeStub.account.set.mock.calls[0][0]).toEqual(mockedSenderAccount.address);
        expect(storeStub.account.set.mock.calls[0][1]).toEqual(expectedSenderAccount);

        expect(storeStub.account.set.mock.calls[1][0]).toEqual(mockedAwardAccount1.address);
        expect(storeStub.account.set.mock.calls[1][1]).toEqual(expectedAccount1);

        expect(storeStub.account.set.mock.calls[2][0]).toEqual(mockedAwardAccount2.address);
        expect(storeStub.account.set.mock.calls[2][1]).toEqual(expectedAccount2);
    });

    test('it should FAIL apply the state if the award is not found', async () => {
        // Arrange
        const senderId = '16313739661670634666L';
        const senderPublicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
        const asset: AwardFeatTransactionAsset = {
            featTypeId: 'someOtherFeatType',
            addresses: ['a', 'b'],
            comment: "Wassup dawg ?",
            date: 1337,
            amount: utils.convertLSKToBeddows('20'),
        };

        const mockedSenderAccount: Partial<IssuerAccount> = {
            address: senderId,
            balance: utils.convertLSKToBeddows('10000'),
            asset: {
                title: "DappIT",
                description: "A distributed and decentralized software company",
                authorityUrl: "http://dappit.fr",
                featTypes: {
                    "someFeatType": {
                        id: "someFeatType",
                        title: "You've been a good boy",
                        description: "Here is a sugar",
                        awardCount: '0'
                    }
                }
            }
        };

        const mockedAwardAccount1 = {
            address: 'a',
            balance: utils.convertLSKToBeddows('0'),
        };

        const mockedAwardAccount2 = {
            address: senderId,
            balance: utils.convertLSKToBeddows('10000'),
            asset: {
                title: "SomeCompany",
                description: "We do stuff",
                authorityUrl: "http://google.com",
                featTypes: {}
            }
        };

        when(storeStub.account.get)
            .calledWith(senderId)
            .mockReturnValue(mockedSenderAccount);

        when(storeStub.account.get)
            .calledWith(mockedAwardAccount1.address)
            .mockReturnValue(mockedAwardAccount1);

        when(storeStub.account.get)
            .calledWith(mockedAwardAccount2.address)
            .mockReturnValue(mockedAwardAccount2);

        // Act
        const tx = new AwardFeatTransaction({
            id: "foo",
            senderId,
            senderPublicKey,
            asset,
        });

        const validationErrors = tx.validateAsset();
        expect(validationErrors).toHaveLength(0);

        const errors = tx.applyAsset(storeStub);
        expect(errors).toHaveLength(1);
    });

    test('it should FAIL apply the state if the awarded account is an issuer', async () => {
        // Arrange
        const senderId = '16313739661670634666L';
        const senderPublicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
        const asset: AwardFeatTransactionAsset = {
            featTypeId: 'someOtherFeatType',
            addresses: ['a', 'b'],
            comment: "Wassup dawg ?",
            date: 1337,
            amount: utils.convertLSKToBeddows('20'),
        };

        const mockedSenderAccount: Partial<IssuerAccount> = {
            address: senderId,
            balance: utils.convertLSKToBeddows('10000'),
            asset: {
                title: "DappIT",
                description: "A distributed and decentralized software company",
                authorityUrl: "http://dappit.fr",
                featTypes: {
                    "someFeatType": {
                        id: "someFeatType",
                        title: "You've been a good boy",
                        description: "Here is a sugar",
                        awardCount: '0'
                    }
                }
            }
        };

        when(storeStub.account.get)
            .calledWith(senderId)
            .mockReturnValue(mockedSenderAccount);

        // Act
        const tx = new AwardFeatTransaction({
            id: "foo",
            senderId,
            senderPublicKey,
            asset,
        });

        const validationErrors = tx.validateAsset();
        expect(validationErrors).toHaveLength(0);

        const errors = tx.applyAsset(storeStub);
        expect(errors).toHaveLength(1);
    });


    test('it should FAIL because of the invalid date', async () => {
        // Arrange
        const senderId = '16313739661670634666L';
        const senderPublicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
        const asset: any = {
            featTypeId: 'someOtherFeatType',
            addresses: ['a', 'b'],
            comment: "Wassup dawg ?",
            date: "hamburger",
            amount: utils.convertLSKToBeddows('20'),
        };

        // Act
        const tx = new AwardFeatTransaction({
            id: "foo",
            senderId,
            senderPublicKey,
            asset,
        });

        const validationErrors = tx.validateAsset();
        expect(validationErrors).toHaveLength(1);
    });

    test('it should undo the state to remove the award to the persons account', async () => {
        // Arrange
        const senderId = '16313739661670634666L';
        const senderPublicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
        const asset: AwardFeatTransactionAsset = {
            featTypeId: 'someFeatType',
            addresses: ['a', 'b'],
            comment: "Wassup dawg ?",
            date: 1337,
            amount: utils.convertLSKToBeddows('20'),
        };

        const tx = new AwardFeatTransaction({
            id: "foo",
            senderId,
            senderPublicKey,
            asset,
        });

        const mockedSenderAccount: Partial<IssuerAccount> = {
            address: senderId,
            balance: utils.convertLSKToBeddows('9980'),
            asset: {
                title: "DappIT",
                description: "A distributed and decentralized software company",
                authorityUrl: "http://dappit.fr",
                featTypes: {
                    "someFeatType": {
                        id: "someFeatType",
                        title: "You've been a good boy",
                        description: "Here is a sugar",
                        awardCount: '0'
                    }
                }
            }
        };

        const mockedAwardAccount1 = {
            address: 'a',
            balance: utils.convertLSKToBeddows('0'),
            asset: {
                awardsReceived: {
                    [tx.id]: {
                        featTypeId: 'someFeatType',
                        comment: "Wassup dawg ?",
                        date: 1337,
                    },
                    ['someId']: {
                        featTypeId: 'someOtherFeatType',
                        comment: "Wassup dawg2 ?",
                        date: 1382,
                    }
                }
            }
        };

        const mockedAwardAccount2 = {
            address: 'b',
            balance: utils.convertLSKToBeddows('0'),
            asset: {
                awardsReceived: {
                    [tx.id]: {
                        featTypeId: 'someFeatType',
                        comment: "Wassup dawg ?",
                        date: 1337,
                    }
                }
            }
        };

        when(storeStub.account.get)
            .calledWith(senderId)
            .mockReturnValue(mockedSenderAccount);

        when(storeStub.account.get)
            .calledWith(mockedAwardAccount1.address)
            .mockReturnValue(mockedAwardAccount1);

        when(storeStub.account.get)
            .calledWith(mockedAwardAccount2.address)
            .mockReturnValue(mockedAwardAccount2);

        // Act
        const validationErrors = tx.validateAsset();
        expect(validationErrors).toHaveLength(0);

        tx.undoAsset(storeStub);

        const expectedSenderAccount = {
            ...mockedSenderAccount,
            balance: utils.convertLSKToBeddows('10000'),
        };

        expectedSenderAccount.asset.featTypes.someFeatType.awardCount = '0';

        const expectedAccount1: Partial<PersonAccount> = {
            ...mockedAwardAccount1,
            asset: {
                awardsReceived: {
                    ['someId']: {
                        featTypeId: 'someOtherFeatType',
                        comment: "Wassup dawg2 ?",
                        date: 1382,
                    }
                }
            }
        };

        const expectedAccount2: Partial<PersonAccount> = {
            ...mockedAwardAccount2,
            asset: {
                awardsReceived: {}
            }
        };

        // Assert
        expect(storeStub.account.set.mock.calls[0][0]).toEqual(mockedSenderAccount.address);
        expect(storeStub.account.set.mock.calls[0][1]).toEqual(expectedSenderAccount);

        expect(storeStub.account.set.mock.calls[1][0]).toEqual(mockedAwardAccount1.address);
        expect(storeStub.account.set.mock.calls[1][1]).toEqual(expectedAccount1);

        expect(storeStub.account.set.mock.calls[2][0]).toEqual(mockedAwardAccount2.address);
        expect(storeStub.account.set.mock.calls[2][1]).toEqual(expectedAccount2);
    });

});
