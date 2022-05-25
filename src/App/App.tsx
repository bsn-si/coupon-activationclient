import { AnimatePresence, motion } from "framer-motion"
import { useMemo, useState } from "react"
import cx from "clsx"

import { EnrichedAccount, Step, StepProps } from "../models"
import * as containers from "../containers"
import { API } from "../api"
import "./App.css"

import gift from "../assets/gift.webp"
const { assign } = Object

const forms = {
  [Step.ChooseAccount]: containers.ChooseAccount,
  [Step.Welcome]: containers.Welcome,
  [Step.Coupon]: containers.Coupon,
  [Step.Finish]: containers.Finish,
}

const DEFAULT_DEV_RPC_URL = "127.0.0.1:9944"

export function App() {
  const api = useMemo(() => new API(DEFAULT_DEV_RPC_URL), [])

  const [account, setAccount] = useState<EnrichedAccount>()
  const [step, setStep] = useState(Step.Welcome)
  const [coupon, setCoupon] = useState<string>()

  const CurrentStep = forms[step]

  const stepProps: StepProps = {
    setAccount,
    setCoupon,
    setStep,

    account,
    coupon,
    step,
    api,
  }

  return (
    <div className={cx("app", `step-${step}`)}>
      <motion.img src={gift} animate={assign({
        // @Todo
      }, step === Step.Welcome ? {
        height: 300,
        width: 300,
      } : {
        height: 150,
        width: 150,
      })} />

      <AnimatePresence>
        <CurrentStep {...stepProps} />
      </AnimatePresence>
    </div>
  )
}
