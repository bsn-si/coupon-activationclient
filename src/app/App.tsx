import { AnimatePresence, motion } from "framer-motion"
import { useMemo, useState } from "react"
import cx from "clsx"

import { EnrichedAccount, Step, StepProps } from "../models"
import { CONTRACT, RPC_URL } from "../utils"
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

export function App() {
  const api = useMemo(() => new API(RPC_URL), [])

  const [contract, setContract] = useState<string | undefined>(CONTRACT)
  const [account, setAccount] = useState<EnrichedAccount>()
  const [step, setStep] = useState(Step.Welcome)
  const [coupon, setCoupon] = useState<string>()

  const CurrentStep = forms[step]

  const stepProps: StepProps = {
    setContract,
    setAccount,
    setCoupon,
    setStep,

    contract,
    account,
    coupon,
    step,
    api,
  }

  return (
    <div className={cx("app", `step-${step}`)}>
      <motion.img
        src={gift}
        animate={assign(
          {
            // @Todo
          },
          [Step.Welcome, Step.Finish].includes(step)
            ? {
                height: 300,
                width: 300,
              }
            : {
                height: 150,
                width: 150,
              },
        )}
      />

      <AnimatePresence>
        <CurrentStep {...stepProps} />
      </AnimatePresence>
    </div>
  )
}
