import { motion } from "framer-motion"
import { useCallback } from "react"

import { Step, StepProps } from "../../models"
import { CONTRACT } from "../../utils"
import "./Finish.css"

export function Finish(props: StepProps) {
  const onGoWelcome = useCallback(async () => {
    props.setContract(CONTRACT)
    props.setAccount(undefined)
    props.setCoupon(undefined)
    props.setStep(Step.Welcome)
  }, [])

  return (
    <motion.div
      className="step finish"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="header">
        <h2 className="title">Success!</h2>
        <h4 className="subtitle">You activated you coupon & receive funds</h4>
      </div>

      <button className="button glow" onClick={onGoWelcome}>
        Start new activation
      </button>
    </motion.div>
  )
}

