const fs = require('fs');

const files = [];
const env = {};

switch (process.env.NODE_ENV) {
    case 'production': files.push('.env.production', '.env.production.local');
    case 'test': files.push('.env.test', '.env.test.local');
    case 'development':
    default: files.push('.env.development', '.env.development.local');
}

files.forEach(filename => {
    if(!fs.existsSync(filename)) return;

    fs.readFileSync(filename).toString()
    .split("\n")
    .map(s => s.trim())
    .filter(entry => entry.length > 0)
    .filter(entry => entry.substr(0, 1) !== '#')
    .forEach(entry => {
        const chunks = entry.split('=');
        const name = chunks.shift();

        if (!isReactVariableName(name)) return;

        env[name] = chunks.join();
    })
});

Object.entries(process.env)
    .filter(([key]) => isReactVariableName(key))
    .forEach(([key, value]) => env[key] = value);

const data = `window.APP_CONFIG = ${JSON.stringify(env)};`;

fs.writeFileSync(process.argv[2], data, { flag: 'w+' });

function isReactVariableName(v) {
    const reactPrefix = 'REACT_APP_';
    return v.substr(0, reactPrefix.length) === reactPrefix;
}
