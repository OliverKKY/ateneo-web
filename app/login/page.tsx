import LoginForm from '@/app/ui/login-form'

export default function LoginPage() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#16303a] px-4 text-white">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(10,24,31,0.7),rgba(26,67,79,0.35),rgba(197,106,61,0.25))]" />
                <div className="absolute -top-[18%] left-[8%] h-[26rem] w-[26rem] rounded-full bg-[#d98b5d]/35 blur-[140px]" />
                <div className="absolute bottom-[-8%] right-[-2%] h-[24rem] w-[24rem] rounded-full bg-[#8cb7b5]/20 blur-[120px]" />
            </div>

            <div className="relative z-10 grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div className="max-w-xl">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#f4d8c7]">Ateneo intranet</p>
                    <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                        Jedno místo pro sbor, události i archiv skladeb.
                    </h1>
                    <p className="mt-6 max-w-lg text-base leading-7 text-slate-200 md:text-lg">
                        Interní rozhraní pro členy a vedení sboru. Správa účtů, přihlašování na akce a práce se skladbami v jednotném prostředí.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200/90">
                        <span className="rounded-full border border-white/15 bg-white/8 px-4 py-2 backdrop-blur-sm">Události a docházka</span>
                        <span className="rounded-full border border-white/15 bg-white/8 px-4 py-2 backdrop-blur-sm">Uživatelské role</span>
                        <span className="rounded-full border border-white/15 bg-white/8 px-4 py-2 backdrop-blur-sm">Archiv partitur</span>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-md">
                    <div className="absolute inset-0 rounded-[2rem] bg-white/10 blur-2xl" />
                    <div className="relative rounded-[2rem] border border-white/15 bg-white/8 p-4 shadow-2xl backdrop-blur-xl">
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-extrabold tracking-[0.18em] uppercase text-white">Ateneo</h2>
                            <p className="mt-2 text-sm text-slate-300">Interní systém pěveckého sboru</p>
                        </div>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </main>
    )
}
