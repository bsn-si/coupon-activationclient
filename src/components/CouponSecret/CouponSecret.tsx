import { useCallback, useRef, useState } from "react"
import Keyring from "@polkadot/keyring"
import { isHex } from "@polkadot/util"
import cx from "clsx"

import { useOutside } from "../../hooks"
import { StepProps } from "../../models"
import { delay } from "../../utils"

import { GiftIcon } from "./GiftIcon"
import "./CouponSecret.css"

interface Props extends Pick<StepProps, "coupon" | "setCoupon"> {}
const keyring = new Keyring({ type: "sr25519" })

export function CouponSecret({ coupon, setCoupon }: Props) {
  const [editable, setEditable] = useState(false)
  const [secret, setSecret] = useState(coupon)
  const [error, setError] = useState<string>()
  const inputRef = useRef<HTMLInputElement>()

  const onSecretChange = useCallback((event: any) => {
    const { value } = event.target
    setError(undefined)
    setSecret(value)
  }, [])

  const onApply = useCallback(async () => {
    try {
      if (!isHex(secret)) {
        throw new Error("Invalid hex")
      }

      await keyring.addFromUri(secret)
      setError(undefined)
      setEditable(false)
      setCoupon(secret)
    } catch (error) {
      setError("Coupon secret invalid")
      setSecret(coupon)
    }
  }, [secret])

  const onKeyDown = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        onApply()
      }
    },
    [onApply],
  )

  const onClickEdit = useCallback(async () => {
    setEditable(true)
    await delay(50)

    inputRef?.current?.focus()
  }, [])

  const onClickOutside = useCallback(async () => {
    setSecret(coupon)
    setError(undefined)
    setEditable(false)
  }, [])

  useOutside(inputRef, onClickOutside)

  return (
    <div className={cx("coupon-secret", { invalid: !!error, edit: editable })}>
      <div className="icon">
        <GiftIcon />
      </div>

      {editable ? (
        <>
          {error && <div className="error">{error}</div>}

          <input
            placeholder="Coupon secret in hex"
            onChange={onSecretChange}
            onKeyDown={onKeyDown}
            ref={inputRef}
            value={secret}
            name="coupon"
          />
        </>
      ) : (
        <div className="meta" onClick={onClickEdit}>
          <div className="label">Coupon Secret</div>
          <div className="coupon">{secret || "Need coupon secret hex"}</div>
        </div>
      )}
    </div>
  )
}
