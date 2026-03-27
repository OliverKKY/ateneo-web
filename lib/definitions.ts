import { z } from 'zod'

export const EmailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Neplatný email.' })

export const LoginSchema = z.object({
    email: EmailSchema,
    password: z.string().min(1, { message: 'Heslo je povinné.' }),
})

export const ROLES = {
    ADMIN: 'Administrátor',
    SINGER: 'Zpěvák',
    CHOIRMASTER: 'Sbormistr',
    SECTION_LEADER: 'Hlasový vedoucí',
    DRESSCODE_LADY: 'Dresscode lady',
    CHAIR: 'Předseda',
    VICE_CHAIR: 'Místopředseda',
    NOTARY: 'Notář',
    MANAGER: 'Manažer',
} as const

export type RoleName = (typeof ROLES)[keyof typeof ROLES]

export const ADMIN_ONLY_ROLES = [ROLES.ADMIN] as const
export const SONG_EDITOR_ROLES = [ROLES.ADMIN, ROLES.NOTARY, ROLES.CHOIRMASTER] as const
export const SONG_DELETE_ROLES = [ROLES.ADMIN, ROLES.NOTARY] as const
export const EVENT_MANAGER_ROLES = [ROLES.ADMIN, ROLES.MANAGER, ROLES.CHAIR] as const

export const VOICES = ['S', 'A', 'T', 'B'] as const
export const EVENT_TYPES = ['CONCERT', 'RETREAT'] as const
export const SIGNUP_STATUSES = ['going', 'maybe', 'not_going'] as const
export const SHEET_TYPES = [
    'SATB',
    'SSA',
    'SSAA',
    'TTBB',
    'SAB',
    'UNISON',
    'INSTRUMENTAL',
    'OTHER',
] as const

export const VOICE_LABELS: Record<(typeof VOICES)[number], string> = {
    S: 'Soprán',
    A: 'Alt',
    T: 'Tenor',
    B: 'Bas',
}

export const EVENT_TYPE_LABELS: Record<(typeof EVENT_TYPES)[number], string> = {
    CONCERT: 'Koncert',
    RETREAT: 'Soustředění',
}

export const SHEET_TYPE_LABELS: Record<(typeof SHEET_TYPES)[number], string> = {
    SATB: 'SATB',
    SSA: 'SSA',
    SSAA: 'SSAA',
    TTBB: 'TTBB',
    SAB: 'SAB',
    UNISON: 'Unisono',
    INSTRUMENTAL: 'Instrumentální doprovod',
    OTHER: 'Jiné',
}

export const VoiceSchema = z.enum(VOICES)
export const EventTypeSchema = z.enum(EVENT_TYPES)
export const SignupStatusSchema = z.enum(SIGNUP_STATUSES)
export const SheetTypeSchema = z.enum(SHEET_TYPES)

export type SignupStatus = z.infer<typeof SignupStatusSchema>
export type EventType = z.infer<typeof EventTypeSchema>
export type Voice = z.infer<typeof VoiceSchema>
export type SheetType = z.infer<typeof SheetTypeSchema>

export type SessionPayload = {
    userId: number
    role: RoleName
    expiresAt: string
}

export type ActionState<TField extends string = string> = {
    errors?: Partial<Record<TField, string[]>>
    message?: string
    success?: boolean
}
