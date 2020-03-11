import { Application, genesisBlockDevnet, configDevnet } from 'lisk-sdk';
import appConfig from './config/devnet.json';
import {CreateIssuerTransaction} from "./transactions/CreateIssuerTransaction";
import {CreateFeatTypeTransaction} from "./transactions/CreateFeatTypeTransaction";
import {AwardFeatTransaction} from "./transactions/AwardFeatTransaction";

const config = {...configDevnet, ...appConfig};

try {

    const app = new Application(genesisBlockDevnet, config);

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
