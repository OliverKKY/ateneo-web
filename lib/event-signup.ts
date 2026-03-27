export type SignupWindowInput = {
    signupOpenDate?: Date | null
    signupCloseDate?: Date | null
    startDateTime: Date
}

export type SignupAvailability = {
    canSignup: boolean
    reason?: string
    state: 'open' | 'not_open_yet' | 'closed' | 'started'
}

export function getSignupAvailability(
    event: SignupWindowInput,
    now = new Date(),
): SignupAvailability {
    if (event.signupOpenDate && now < event.signupOpenDate) {
        return {
            canSignup: false,
            state: 'not_open_yet',
            reason: 'Přihlašování ještě není otevřené.',
        }
    }

    if (event.signupCloseDate && now > event.signupCloseDate) {
        return {
            canSignup: false,
            state: 'closed',
            reason: 'Přihlašování už je uzavřené.',
        }
    }

    if (now >= event.startDateTime) {
        return {
            canSignup: false,
            state: 'started',
            reason: 'Událost už začala.',
        }
    }

    return {
        canSignup: true,
        state: 'open',
    }
}
