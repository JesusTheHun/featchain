export default {
    "app": {
        "label": "featchain",
        "minVersion": "0.0.1",
        "version": "0.0.1",
        "protocolVersion": "1.1",
        "ipc": {
            "enabled": true
        },
        "genesisConfig": {
            "EPOCH_TIME": "2016-05-24T17:00:00.000Z",
            "BLOCK_TIME": 10,
            "MAX_TRANSACTIONS_PER_BLOCK": 25,
            "REWARDS": {
                "MILESTONES": [
                    "500000000",
                    "400000000",
                    "300000000",
                    "200000000",
                    "100000000"
                ],
                "OFFSET": 2160,
                "DISTANCE": 3000000
            }
        }
    },
    "components": {
        "logger": {
            "fileLogLevel": "debug",
            "logFileName": "logs/devnet/lisk.log",
            "consoleLogLevel": "info"
        },
        "storage": {
            "host": process.env.POSTGRES_HOST,
            "port": Number(process.env.POSTGRES_PORT).valueOf(),
            "database": process.env.POSTGRES_DB,
            "user": process.env.POSTGRES_USER,
            "password": process.env.POSTGRES_PASSWORD
        },
    },
    "modules": {
        "http_api": {
            "access": {
                "public": true,
            },
            "httpPort": Number(process.env.HTTP_API_PORT).valueOf()
        }
    }
}
