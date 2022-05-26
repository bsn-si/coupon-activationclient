import { decodeAddress } from "@polkadot/keyring"
import { useCallback, useState } from "react"
import { u8aToHex } from "@polkadot/util"
import { motion } from "framer-motion"
import { ErrorCode } from "ocex-api"

import { Account, CouponInput } from "../../components"
import { Step, StepProps } from "../../models"
import "./Coupon.css"

const ERROR_MESSAGES = {
  [ErrorCode.InvalidParseCouponSignature]: "Invalid parse coupon signature",
  [ErrorCode.ContractBalanceNotEnough]: "Contract balance not enough",
  [ErrorCode.VerifySignatureFailed]: "Verify signature failed",
  [ErrorCode.CouponAlreadyBurned]: "Coupon already burned",
  [ErrorCode.CouponAlreadyExists]: "Coupon already exists",
  [ErrorCode.InvalidParseCoupon]: "Invalid parse coupon",
  [ErrorCode.CouponNotFound]: "Coupon not found",
  [ErrorCode.TransferFailed]: "Transfer failed",
  [ErrorCode.AccessOwner]: "Access owner",
}

const CONTRACT_ADDRESS = "0xfe53754a8ca38a390d9096a30db04e341ecf85ea8f1d9544b71e564494fa7f38"

export function Coupon({ setCoupon, setStep, account, coupon, api }: StepProps) {
  const [error, setError] = useState<string>()

  const onActivateCoupon = useCallback(async () => {
    if (account && coupon) {
      try {
        const receiver = u8aToHex(decodeAddress(account.address))
        const isActivated = await api.activateCoupon(CONTRACT_ADDRESS, receiver, coupon)

        if (isActivated) {
          setStep(Step.Finish)
        }
      } catch (error: any) {
        if (error.data && ErrorCode[error.data]) {
          setError(ERROR_MESSAGES[error.data])
        } else {
          setError(error.message)
        }
      }
    }
  }, [api, account, coupon])

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
        <Account {...account} />
        <CouponInput coupon={coupon} setCoupon={setCoupon} />
      </div>

      {error && <div className="error message">{error}</div>}

      {coupon && (
        <button className="button glow" onClick={onActivateCoupon}>
          Activate Coupon
        </button>
      )}
    </motion.div>
  )
}
