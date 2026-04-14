import type { Metadata } from 'next'
import { ChangePasswordForm } from '@/app/ui/profile/change-password-form'

export const metadata: Metadata = {
    title: 'Můj profil',
}

export default function ProfilePage() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#b56a44]">
                    Účet
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-[#241612]">Můj profil</h1>
                <p className="max-w-2xl text-sm leading-6 text-[#6c5148]">
                    Správa přístupových údajů pro interní část webu.
                </p>
            </div>
            <div className="rounded-[28px] border border-white/70 bg-[rgba(255,248,242,0.84)] p-7 shadow-[0_30px_60px_rgba(86,56,40,0.12)] backdrop-blur">
                <h2 className="mb-2 text-lg font-semibold text-[#241612]">Změna hesla</h2>
                <p className="mb-6 text-sm text-[#6c5148]">
                    Pro potvrzení změny zadejte nejdříve současné heslo.
                </p>
                <ChangePasswordForm />
            </div>
        </div>
    )
}
