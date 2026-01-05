import type { User } from '@/api/type'
import { useField, useForm } from 'vee-validate'

export function useUserForm() {
  const { handleSubmit, handleReset } = useForm({
    validationSchema: {
      name(value: string) {
        if (value && value.length >= 3) {
          return true
        }
        return 'Name must be at least 3 characters'
      },
      email(value: string) {
        if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) {
          return true
        }
        return 'Invalid email format'
      },
      role(value: string) {
        if (value && ['admin', 'manager', 'user'].includes(value)) {
          return true
        }
        return 'Please select a role'
      },
      phones(value: Array<{ label: string; number: string }>) {
        if (!value || value.length === 0) {
          return true
        }

        const errors: any[] = []

        for (const [index, phone] of value.entries()) {
          const phoneErrors: any = {}

          if (!phone.label) {
            phoneErrors.label = 'Label is required'
          }

          if (!phone.number) {
            phoneErrors.number = 'Phone number is required'
          } else if (!/^\d{10,}$/.test(phone.number)) {
            phoneErrors.number = 'Phone must be at least 10 digits'
          }

          if (Object.keys(phoneErrors).length > 0) {
            errors[index] = phoneErrors
          }
        }

        return errors.length > 0 ? errors : true
      },
    },
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
