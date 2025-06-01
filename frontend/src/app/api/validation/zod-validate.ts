import { z } from 'zod'

export type ValidationResult = {
  success: boolean
  data?: unknown
  errors?: Record<string, string>
}

export function validate(data: unknown, schema: z.ZodSchema): ValidationResult {
  try {
    const validData = schema.parse(data)
    return { success: true, data: validData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0]] = err.message
        }
      })
      return { success: false, errors }
    }
    return {
      success: false,
      errors: { _form: 'Validation failed' },
    }
  }
}
