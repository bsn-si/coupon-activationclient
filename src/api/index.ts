import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp"
// import { get_coupon_signature } from "ocex-coupon-signature-web"
import { WsProvider, ApiPromise } from "@polkadot/api"
import { ApiBase } from "@polkadot/api/base"
import { Coupon, Ocex } from "ocex-api"
import BN from "bn.js"

import { EnrichedAccount } from "../models"
import { delay } from "../utils"

export class API {
  client: ApiBase<"promise"> | undefined
  apiUrl: string

  constructor(apiUrl: string) {
    this.apiUrl = `ws://${apiUrl}`
  }

  async init() {
    const provider = new WsProvider(this.apiUrl, false)
    await provider.connect()
    await delay(100)

    if (!provider.isConnected) {
      throw new Error(`Connect to '${this.apiUrl}' failed, try again later`)
    }

    const client = await ApiPromise.create({ provider })

    const [chain, nodeName, nodeVersion] = await Promise.all([
      client.rpc.system.chain(),
      client.rpc.system.name(),
      client.rpc.system.version(),
    ])

    console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`)
    this.client = client
  }

  async requestAccess() {
    await web3Enable("ocex")
  }

  async accounts(): Promise<EnrichedAccount[]> {
    const list = await web3Accounts()

    const accounts = Promise.all(
      list.map(account =>
        (async () => {
          const balance = await this.accountBalance(account.address)

          return {
            ...account,
            balance,
          }
        })(),
      ),
    )

    return accounts
  }

  async accountBalance(address: string): Promise<BN> {
    if (!this.client) {
      throw new Error("Doesn't have api instance")
    }

    const {
      data: { free },
    } = (await this.client.query.system.account(address)) as any

    return free
  }

  async activateCoupon(address: string, receiver: string, couponSecret: string) {
    if (!this.client) {
      throw new Error("API client not initialized")
    }

    const { signer } = await web3FromAddress(receiver)
    const contract = await Ocex.fromAddress(this.client, [receiver, signer], address)
    // contract.get_coupon_signature = get_coupon_signature
    
    const coupon = new Coupon(couponSecret)
    const result = await contract.activateCoupon(coupon, receiver)

    return result
  }
}
