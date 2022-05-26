import { decodeAddress } from "@polkadot/keyring"
import { useCallback, useState } from "react"
import { u8aToHex } from "@polkadot/util"
import { motion } from "framer-motion"
import { ErrorCode } from "ocex-api"
import cx from "clsx"

import { Account, ContractAddress, CouponSecret, Spinner } from "../../components"
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

export function Coupon({
  setCoupon,
  setStep,
  setContract,
  account,
  coupon,
  contract,
  api,
}: StepProps) {
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const onActivateCoupon = useCallback(async () => {
    if (account && coupon && contract) {
      setLoading(true)

      try {
        const receiver = u8aToHex(decodeAddress(account.address))
        const isActivated = await api.activateCoupon(contract, receiver, coupon)

        if (isActivated) {
          setStep(Step.Finish)
        }
      } catch (error: any) {
        if (error.data && ErrorCode[error.data]) {
          setError(ERROR_MESSAGES[error.data])
        } else {
          setError(error.message)
        }
      } finally {
        setLoading(false)
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
        {loading && (
          <div className="loading">
            <Spinner />
          </div>
        )}

        <div className={cx("inputs", { loading })}>
          <Account {...account} />
          <ContractAddress contract={contract} setContract={setContract} />
          <CouponSecret coupon={coupon} setCoupon={setCoupon} />
        </div>
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
