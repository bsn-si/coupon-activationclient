import { useCallback, useState } from "react"
import Keyring from "@polkadot/keyring"
import cx from "clsx"

import { StepProps } from "../../models"
import { GiftIcon } from "./GiftIcon"

import "./CouponInput.css"

interface Props extends Pick<StepProps, "coupon" | "setCoupon"> {}
const keyring = new Keyring({ type: "sr25519" })

export function CouponInput({ setCoupon, coupon }: Props) {
  const [secretIsInvalid, setSecretIsInvalid] = useState(false)
  const [secret, setSecret] = useState("")

  const onSecretChange = useCallback(
    (event: any) => {
      const { value } = event.target

      try {
        setSecret(value)

        keyring.addFromUri(value)
        setSecretIsInvalid(false)
        setCoupon(value)
      } catch (error) {
        setSecretIsInvalid(true)
        setCoupon(undefined)
      }
    },
    [setCoupon],
  )

  return (
    <div className={cx("coupon-input", { invalid: secretIsInvalid })}>
      <GiftIcon className="icon" />

      <input
        placeholder="Please enter you coupon key"
        onChange={onSecretChange}
        value={secret}
        name="coupon"
      />
    </div>
  )
}
