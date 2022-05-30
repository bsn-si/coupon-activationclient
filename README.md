## Disclaimer
> 💀 This is a **Work in Progress**.  
> Current status: Common PoC data storage and methods available. Partially tested.   
> **Use at your own risk**.

<h1 align="center">
    🎟️ ✨ OCEX Activation Client 🎁 👛
</h1>

OCEX coupon activation DApp.

## Features
DApp can interact with custom RPC and contracts and use polkadot.js extensions to sign transactions.
- You can configure target RPC url.
- Select accounts from your extension to receive funds.
- Set target contract instance address.
- Sign & send activation via RPC to the contract

## Simple usage
Current version of dapp:
[Run DApp](https://bsn-si.github.io/ocex-activation/) 

## Build & Run
```
git clone git@github.com:bsn-si/ocex-activationclient.git
cd ocex-activationclient/

# install dependencies via yarn
yarn
# OR
npm install

# For dev-server run
yarn start
# For production build
yarn build
```

Also you can preset RPC URL and contract address from `.env` before build.  

```
# You can preset RPC node URL
RPC_URL=ws://127.0.0.1:9944
# You can preset contract address
CONTRACT=<contract address hex or ss58>
```

## License
[Apache License 2.0](https://github.com/bsn-si/ocex-activation/blob/main/license) © Bela Supernova ([bsn.si](https://bsn.si))
