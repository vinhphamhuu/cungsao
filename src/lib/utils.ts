import {type ClassValue, clsx} from 'clsx'
import {customAlphabet} from 'nanoid'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createId(prefix: string): string {
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 20)
  return `${prefix}_${nanoid()}`
}
