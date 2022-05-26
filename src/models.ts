import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import BN from "bn.js"

import { API } from "./api"

export type EnrichedAccount = InjectedAccountWithMeta & { balance: BN }
type SetState<T> = React.Dispatch<React.SetStateAction<T>>

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
  contract?: string
  coupon?: string
  
  setAccount: SetState<EnrichedAccount | undefined>
  setContract: SetState<string | undefined>
  setCoupon: SetState<string | undefined>
  setStep: SetState<Step>
  
  step: Step
  api: API
}
