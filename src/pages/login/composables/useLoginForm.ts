import { useField, useForm } from 'vee-validate'

export function useLoginForm() {
  const { handleSubmit, handleReset } = useForm({
    validationSchema: {
      email(value: string) {
        if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) {
          return true
        }
        return 'Invalid email format'
      },
      password(value: string) {
        if (value && value.length >= 6) {
          return true
        }
        return 'Password must be at least 6 characters'
      },
    },
  })

  const email = useField<string>('email')
  const password = useField<string>('password')

  function reset() {
    handleReset()
  }

  return {
    email,
    password,
    handleSubmit,
    reset,
  }
}
