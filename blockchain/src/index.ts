import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

import { Application, genesisBlockDevnet, configDevnet } from 'lisk-sdk';
import appConfig from './config/devnet';
import {CreateIssuerTransaction, CreateFeatTypeTransaction, AwardFeatTransaction} from "./transactions";
import {FaucetTransaction} from "lisk-transaction-faucet/dist";

const config = {...configDevnet, ...appConfig};

try {

    const app = new Application(genesisBlockDevnet, config);

    app.registerTransaction(FaucetTransaction);
    app.registerTransaction(CreateIssuerTransaction);
    app.registerTransaction(CreateFeatTypeTransaction);
    app.registerTransaction(AwardFeatTransaction);

    app
        .run()
        .then(() => app.logger.info('App started...'))
        .catch(error => {
            if (error instanceof Error) {
                app.logger.error('App stopped with error', error.message);
                app.logger.debug(error.stack);
            } else {
                app.logger.error('App stopped with error', error);
            }
            process.exit();
        });
} catch (e) {
    // tslint:disable-next-line no-console
    console.error('Application start error.', e);
    process.exit();
}
