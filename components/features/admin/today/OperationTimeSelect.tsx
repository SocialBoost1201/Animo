'use client'

import { type SelectHTMLAttributes } from 'react'
import { getOperationTimeOptions } from '@/lib/operation-hours'

type OperationTimeSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'>

export function OperationTimeSelect({ className, ...props }: OperationTimeSelectProps) {
  return (
    <select className={className} {...props}>
      <option value="">Select Time</option>
      {getOperationTimeOptions().map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
