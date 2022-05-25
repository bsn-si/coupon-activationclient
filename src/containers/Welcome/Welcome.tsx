import { useCallback, useState } from "react"
import { motion } from "framer-motion"

import { Step, StepProps } from "../../models"
import "./Welcome.css"

export function Welcome({ api, setStep }: StepProps) {
  const [error, setError] = useState<string>()

  const onGoCoupon = useCallback(async () => {
    try {
      await api.init()
      setError(undefined)
      setStep(Step.ChooseAccount)
    } catch (error: any) {
      setError(error.message)
    }
  }, [api, setStep])

  return (
    <motion.div
      className="step welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="header">
        <h2 className="title">Welcome to OCEX</h2>
        <h4 className="subtitle">Here you can activate you coupon</h4>
      </div>

      {error && <div className="error">{error}</div>}

      <button className="button glow" onClick={onGoCoupon}>
        Continue
      </button>
    </motion.div>
  )
}

