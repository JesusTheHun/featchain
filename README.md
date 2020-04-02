# FeatChain - The achievement blockchain

The FeatChain project aims to provide a single source of truth for people's achievement.
Authorities awards users upon their feat, and this can later be verified by institutions or corporations on the platform.
Since it's run on a blockchain, FeatChain is a trustless platform.

### Prerequisites

This project is build using the [Lisk](https://lisk.io) SDK. You can follow their setup guide [here](https://lisk.io/documentation/lisk-sdk/setup.html).

### Installing from sources

Edit `blockchain/.env` to match your system installation of Postgres.
Then :

```bash
cd blockchain
nvm use
npm i
npm start
cd ../webapp
yarn
npm start
```

### Installing from Docker Compose

```bash
docker-compose up -d
```

If you use a docker machine and therefore you do not access containers services through `localhost`

```bash
PUBLIC_API_URL=http://docker_machine:4000
```
 
you have to change the environment variable in `.env` to set the correct value.

### Build With

* [Lisk](https://lisk.io) for the blockchain
* [Jest](http://jestjs.io) for testing
* [ReactJS](https://reactjs.org) for the front-end
* [Redux]() for the front-end data management
* [typesafe-actions](https://github.com/piotrwitek/typesafe-actions) for Redux type safety 

### Acknowledgments

Special mention to this [**fantastic** typescript guide](https://github.com/piotrwitek/react-redux-typescript-guide).
If this guide is useful to you, please consider a donation. Even 1$ is useful. 

### Authors

This project has been developed by Jonathan 'JesusTheHun' MASSUCHETTI.

### License

This project is licensed under the GPL v3 License
