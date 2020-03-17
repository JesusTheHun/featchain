import {CreateIssuerPayload} from "./types";
import {APIClient} from "@liskhq/lisk-api-client";
import {CreateIssuerTransaction, IssuerAccount} from "featchain-transactions";
import {convertLSKToBeddows} from "@liskhq/lisk-transactions/dist-node/utils";
import {APIResponse} from "@liskhq/lisk-api-client/dist-node/api_types";

const { EPOCH_TIME } = require('@liskhq/lisk-constants');
const {getNetworkIdentifier} = require('@liskhq/lisk-cryptography');

const networkIdentifier = getNetworkIdentifier(
    "23ce0366ef0a14a91e5fd4b1591fc880ffbef9d988ff8bebf8f3666b0c09597d",
    "Lisk",
);

const getBlockchainTimestamp = () => {
  // check config file or curl localhost:4000/api/node/constants to verify your epoc time
  const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
  const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
  return  parseInt(inSeconds);
};

export function fetchIssuer(address: string): Promise<IssuerAccount> {
  const client = APIClient.createMainnetAPIClient();
  return client.accounts.get({ address }).then(r => r.data as IssuerAccount);
}

export function createIssuer(passphrase: string, title: string, description: string, authorityUrl: string): Promise<APIResponse> {

  const transactionPayload: CreateIssuerPayload = {
    networkIdentifier,
    timestamp: getBlockchainTimestamp(),
    asset: {
      amount: convertLSKToBeddows('5000'),
      title,
      description,
      authorityUrl,
    }
  };

  const transaction = new CreateIssuerTransaction(transactionPayload);
  transaction.sign(passphrase);

  const client = APIClient.createMainnetAPIClient();
  return client.transactions.broadcast(transaction.toJSON());
}
