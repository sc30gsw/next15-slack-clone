import 'server-only'
import { auth } from '@/auth'
import { cache } from 'react'

export const getSession = cache(auth)
