import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { z } from 'zod'

const validationSchema = toTypedSchema(
  z.object({
    email: z.email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
)

export function useLoginForm() {
  const { handleSubmit, handleReset } = useForm({
    validationSchema,
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
