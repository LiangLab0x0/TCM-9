import type { z } from 'zod'
import type { Database } from './entities'
import { DatabaseSchema } from './entities'

export function validateDatabase(data: unknown): Database {
  return DatabaseSchema.parse(data)
}

export function safeParseDatabasePartial(data: unknown): {
  success: boolean
  data?: Partial<Database>
  error?: z.ZodError
} {
  const result = DatabaseSchema.partial().safeParse(data)
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    error: result.success ? undefined : result.error,
  }
}

export function validateDatabaseFile(filePath: string): Promise<Database> {
  return fetch(filePath)
    .then((res) => res.json())
    .then((data) => validateDatabase(data))
}
