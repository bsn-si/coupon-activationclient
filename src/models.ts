import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import BN from "bn.js"

import { API } from "./api"

export type EnrichedAccount = InjectedAccountWithMeta & { balance: BN }

export enum Step {
  // Welcome message
  Welcome = "welcome",
  // Choose account form with request polkadot.js extension access
  ChooseAccount = "choose_account",
  // Enter coupon form
  Coupon = "coupon",
  // Finish message and congrats or errors
  Finish = "finish",
}

export interface StepProps {
  account?: EnrichedAccount
  coupon?: string
  step: Step

  setAccount: React.Dispatch<React.SetStateAction<EnrichedAccount | undefined>>
  setCoupon: React.Dispatch<React.SetStateAction<string | undefined>>
  setStep: React.Dispatch<React.SetStateAction<Step>>

  api: API
}
