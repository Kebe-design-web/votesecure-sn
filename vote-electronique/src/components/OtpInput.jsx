import { useRef } from 'react'
import './OtpInput.css'

function OtpInput({ value, onChange, length = 6 }) {
  const inputs = useRef([])
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length)

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '')
    if (!val) return
    const newDigits = [...digits]
    newDigits[index] = val.slice(-1)
    onChange(newDigits.join(''))
    if (index < length - 1) inputs.current[index + 1]?.focus()
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newDigits = [...digits]
      if (newDigits[index]) {
        newDigits[index] = ''
        onChange(newDigits.join(''))
      } else if (index > 0) {
        inputs.current[index - 1]?.focus()
        newDigits[index - 1] = ''
        onChange(newDigits.join(''))
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < length - 1) inputs.current[index + 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted.padEnd(length, '').slice(0, length))
    inputs.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div className="otp-row">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          className={`otp-box ${digit ? 'filled' : ''} ${i === value.length ? 'active' : ''}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  )
}

export default OtpInput