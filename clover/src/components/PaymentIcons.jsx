import React from 'react'
import { SiPhonepe, SiGooglepay, SiPaytm, SiRazorpay } from 'react-icons/si'
import { FaCcVisa, FaCcMastercard, FaMoneyBillWave } from 'react-icons/fa6'

// Real brand marks from react-icons (Simple Icons / Font Awesome) — brand colours kept.
export const PhonePe = () => <SiPhonepe color="#5f259f" aria-label="PhonePe" />
export const GPay = () => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
    alt="Google Pay"
    loading="lazy"
    style={{ height: 16, width: 'auto', display: 'block' }}
  />
)
export const Paytm = () => (
  <img
    src="https://cdn.simpleicons.org/paytm/00BAF2"
    alt="Paytm"
    loading="lazy"
    style={{ height: 18, width: 'auto', display: 'block' }}
  />
)
export const Razorpay = () => <SiRazorpay color="#0C2451" aria-label="Razorpay" />
export const Visa = () => <FaCcVisa color="#1A1F71" aria-label="Visa" />
export const Mastercard = () => <FaCcMastercard color="#EB001B" aria-label="Mastercard" />
export const CashIcon = () => <FaMoneyBillWave color="#2f7d4f" aria-label="Cash on Delivery" />

export default function PaymentIcons() {
  return (
    <div className="pay-icons" aria-label="Accepted payment methods">
      <span className="pay-chip txt" title="UPI" style={{ color: '#097939' }}>UPI</span>
      <span className="pay-chip" title="PhonePe"><PhonePe /></span>
      <span className="pay-chip" title="Google Pay"><GPay /></span>
      <span className="pay-chip" title="Paytm"><Paytm /></span>
      <span className="pay-chip" title="Cash on Delivery"><CashIcon /></span>
    </div>
  )
}
