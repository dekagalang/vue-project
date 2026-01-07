import type { User } from '@/api/type'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { z } from 'zod'

const validationSchema = toTypedSchema(
  z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.email('Invalid email format'),
    role: z.enum(['admin', 'manager', 'user']),
    phones: z
      .array(
        z.object({
          label: z.string().min(1, 'Label is required'),
          number: z
            .string()
            .regex(/^\d{10,}$/, 'Phone must be at least 10 digits'),
        }),
      )
      .optional(),
  }),
)

export function useUserForm() {
  const { handleSubmit, handleReset } = useForm({
    validationSchema,
  })

  const name = useField<string>('name')
  const email = useField<string>('email')
  const role = useField<string>('role')
  const phones = useField<Array<{ label: string; number: string }>>('phones')

  function getPhoneLabel(index: number): string {
    return phones.value.value?.[index]?.label ?? ''
  }

  function setPhoneLabel(index: number, value: string) {
    if (phones.value.value && phones.value.value[index]) {
      phones.value.value[index].label = value
    }
  }

  function getPhoneNumber(index: number): string {
    return phones.value.value?.[index]?.number ?? ''
  }

  function setPhoneNumber(index: number, value: string) {
    if (phones.value.value && phones.value.value[index]) {
      phones.value.value[index].number = value
    }
  }

  function initializeForCreate() {
    name.value.value = ''
    email.value.value = ''
    role.value.value = 'user'
    phones.value.value = [{ label: 'Primary', number: '' }]
  }

  function initializeForEdit(user: User) {
    name.value.value = user.name
    email.value.value = user.email
    role.value.value = user.role
    phones.value.value = user.phones.map(p => ({
      label: p.label,
      number: p.number,
    }))
  }

  function addPhone() {
    phones.value.value = [...phones.value.value, { label: '', number: '' }]
  }

  function removePhone(index: number) {
    phones.value.value = phones.value.value.filter((_, i) => i !== index)
  }

  function reset() {
    handleReset()
  }

  return {
    name,
    email,
    role,
    phones,
    handleSubmit,
    getPhoneLabel,
    setPhoneLabel,
    getPhoneNumber,
    setPhoneNumber,
    initializeForCreate,
    initializeForEdit,
    addPhone,
    removePhone,
    reset,
  }
}
