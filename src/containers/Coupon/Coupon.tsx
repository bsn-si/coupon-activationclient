import { useCallback, useEffect, useState } from "react"
import { BalanceGrade, fmtBalance } from "ocex-api"
import { Keyring } from "@polkadot/keyring"
import { motion } from "framer-motion"
import BN from "bn.js"
import cx from "clsx"

import { Step, StepProps } from "../../models"
import { Account } from "../../components"
import { GiftIcon } from "./GiftIcon"
import "./Coupon.css"

const keyring = new Keyring({ type: "sr25519" })
const CONTRACT_ADDRESS = "0xfe53754a8ca38a390d9096a30db04e341ecf85ea8f1d9544b71e564494fa7f38"

export function Coupon({ setCoupon, setStep, account, coupon, api }: StepProps) {
  const [secretIsInvalid, setSecretIsInvalid] = useState(false)
  const [error, setError] = useState<string>()
  const [secret, setSecret] = useState("")

  const onActivateCoupon = useCallback(async () => {
    if (account && coupon) {
      try {
        const result = await api.activateCoupon(CONTRACT_ADDRESS, account.address, coupon)
        console.log(result)
      } catch (error: any) {
        console.log(error)
      }
    }
  }, [api, account, coupon])

  const onSecretChange = useCallback(
    (event: any) => {
      const { value } = event.target

      try {
        setSecret(value)

        // Simple validation
        keyring.addFromUri(value)
        setSecretIsInvalid(false)
        setCoupon(value)
      } catch (error) {
        setSecretIsInvalid(true)
      }
    },
    [setCoupon],
  )

  return (
    <motion.div
      className="step coupon"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="header">
        <h2 className="title">Enter Coupon</h2>
        <h4 className="subtitle">Enter you coupon & setup contract</h4>
      </div>

      <div className="form">
        <Account {...(account as any)} />

        <div className={cx("coupon", { invalid: secretIsInvalid })}>
          <GiftIcon className="icon" />
          
          <input
            placeholder="Please enter you coupon key"
            onChange={onSecretChange}
            value={secret}
            name="coupon"
          />
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {coupon && (
        <button className="button glow" onClick={onActivateCoupon}>
          Activate Coupon
        </button>
      )}
    </motion.div>
  )
}
