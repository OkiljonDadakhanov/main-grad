import UniversityRegisterForm from '@/components/university-register/UniversityRegisterForm'
import { AuthControls } from "@/components/auth/auth-controls"
import React from 'react'

export default function Register() {
  return (
    <div className="relative">
      <AuthControls />
      <UniversityRegisterForm />
    </div>
  )
}
