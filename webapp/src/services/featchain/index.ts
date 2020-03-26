import {CreateIssuerTransactionPayload, FaucetTransactionPayload, CreateIssuerPayload, AccountDetails, FaucetPayload, CreateFeatTypePayload, CreateFeatTypeTransactionPayload} from "FeatchainTypes";
import {APIClient} from "@liskhq/lisk-api-client";
import {CreateIssuerTransaction, CreateFeatTypeTransaction, IssuerAccount, fees} from "featchain-transactions";
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
  // check config file or curl localhost:4000/api/node/constants to verify your epoc time
  const millisSinceEpoc = Date.now() - EPOCH_TIME.getTime();
  const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
  return  parseInt(inSeconds);
};

const client = APIClient.createTestnetAPIClient({
  node: "http://localhost:4000",
});

export function fetchAccountDetails(address: string): Promise<AccountDetails> {
  return client.accounts.get({ address }).then(r => {
    const data = r.data as unknown[];

    if (data.length === 0) { throw new Error("Account not found"); }

    return data[0] as AccountDetails;
  });
}

export function fetchIssuer(address: string): Promise<IssuerAccount> {
  return client.accounts.get({ address }).then(r => r.data as IssuerAccount);
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
