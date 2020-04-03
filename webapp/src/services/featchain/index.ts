import {CreateIssuerTransactionPayload, FaucetTransactionPayload, CreateIssuerPayload, AccountDetails, FaucetPayload, CreateFeatTypePayload, CreateFeatTypeTransactionPayload, AwardFeatTransactionPayload, AwardFeatPayload} from "FeatchainTypes";
import {APIClient} from "@liskhq/lisk-api-client";
import {FeatTypeId, CreateIssuerTransaction, CreateFeatTypeTransaction, AwardFeatTransaction, fees, PersonAccount, IssuerAccount, Award} from "featchain-blockchain";
import {utils} from "@liskhq/lisk-transactions";
import {APIResponse} from "@liskhq/lisk-api-client/dist-node/api_types";
import {FaucetTransaction} from "lisk-transaction-faucet";
import {EPOCH_TIME} from "@liskhq/lisk-constants";
import {getNetworkIdentifier} from "@liskhq/lisk-cryptography";

const networkIdentifier = getNetworkIdentifier(
    "23ce0366ef0a14a91e5fd4b1591fc880ffbef9d988ff8bebf8f3666b0c09597d",
    "Lisk",
);

const getBlockchainTimestamp = () => {
  const millisSinceEpoc = Date.now() - EPOCH_TIME.getTime();
  const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
  return  parseInt(inSeconds);
};

const client = APIClient.createTestnetAPIClient({
  node: window.APP_CONFIG.REACT_APP_FEATCHAIN_API_URL,
});

export function fetchAccountDetails<T = AccountDetails>(address: string): Promise<T> {
  return client.accounts.get({ address }).then(r => {
    const data = r.data as T[];

    if (data.length === 0) throw new Error("Account not found");

    return data[0];
  });
}

export function fetchTransaction<T>(id: string): Promise<T> {
  return client.transactions.get({ id }).then(r => {
    const data = r.data as T[];

    if (data.length === 0) throw new Error("Transaction not found");

    return data[0];
  });
}

export async function fetchFeatTypeIssuer(featTypeId: FeatTypeId): Promise<IssuerAccount> {
  const tx = await fetchTransaction<CreateFeatTypeTransaction>(featTypeId);
  const account = await fetchAccountDetails<IssuerAccount>(tx.senderId);
  return account;
}

export type FeatsReceived = {
  [txId: string]: CreateFeatTypeTransaction;
};

export async function fetchFeatsReceived(address: string): Promise<{
  account: AccountDetails;
  featsReceived: FeatsReceived;
}> {
  const account = await fetchAccountDetails<PersonAccount>(address);

  if (!account.asset.awardsReceived) {
    const empty = {} as FeatsReceived;
    return { account, featsReceived: empty };
  }

  const p = Object.values(account.asset.awardsReceived).map((award: Award) => {
    return fetchTransaction<CreateFeatTypeTransaction>(award.featTypeId);
  });

  const transactionsArray = await Promise.all(p);
  const featsReceived: FeatsReceived = {};

  transactionsArray.forEach(tx => featsReceived[tx.id] = tx);

  return { account, featsReceived }
}

export function createIssuer(payload: CreateIssuerPayload): Promise<APIResponse> {

  const transactionPayload: CreateIssuerTransactionPayload = {
    networkIdentifier,
    timestamp: getBlockchainTimestamp(),
    asset: {
      amount: fees.createIssuer,
      title: payload.title,
      description: payload.description,
      authorityUrl: payload.authorityUrl,
    },
  };

  const transaction = new CreateIssuerTransaction(transactionPayload);
  transaction.sign(payload.passphrase);

  return client.transactions.broadcast(transaction.toJSON());
}

export function createFeatType(payload: CreateFeatTypePayload): Promise<APIResponse> {

  const transactionPayload: CreateFeatTypeTransactionPayload = {
    networkIdentifier,
    timestamp: getBlockchainTimestamp(),
    asset: {
      amount: fees.createFeatType,
      title: payload.title,
      description: payload.description,
    },
  };

  const transaction = new CreateFeatTypeTransaction(transactionPayload);
  transaction.sign(payload.passphrase);

  return client.transactions.broadcast(transaction.toJSON());
}

export function awardFeat(payload: AwardFeatPayload): Promise<APIResponse> {

  const transactionPayload: AwardFeatTransactionPayload = {
    networkIdentifier,
    timestamp: getBlockchainTimestamp(),
    asset: {
      featTypeId: payload.featTypeId,
      addresses: payload.addresses,
      date: payload.date,
      comment: payload.comment,
      amount: payload.amount,
    },
  };

  const transaction = new AwardFeatTransaction(transactionPayload);
  transaction.sign(payload.passphrase);

  return client.transactions.broadcast(transaction.toJSON());
}

export function faucet(payload: FaucetPayload): Promise<APIResponse> {
  const transactionPayload: FaucetTransactionPayload = {
    networkIdentifier,
    timestamp: getBlockchainTimestamp(),
    asset: {
      amount: utils.convertLSKToBeddows(payload.amount),
      recipientId: payload.address,
    },
  };

  const transaction = new FaucetTransaction(transactionPayload);
  transaction.sign(payload.passphrase);

  return client.transactions.broadcast(transaction.toJSON());
}
