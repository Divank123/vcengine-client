// /hooks/use-toast.ts
import * as React from "react"

import { type ToastActionElement, type ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
    id: string
    title?: React.ReactNode
    description?: React.ReactNode
    action?: ToastActionElement
}

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
    count = (count + 1) % Number.MAX_VALUE
    return count.toString()
}

type ActionType = typeof actionTypes

type Action =
    | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
    | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> }
    | { type: ActionType["DISMISS_TOAST"]; toastId?: string }
    | { type: ActionType["REMOVE_TOAST"]; toastId?: string }

interface State {
    toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function addToRemoveQueue(toastId: string) {
    if (toastTimeouts.has(toastId)) {
        return
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId)
        dispatch({ type: "REMOVE_TOAST", toastId })
    }, TOAST_REMOVE_DELAY)

    toastTimeouts.set(toastId, timeout)
}

const [state, dispatch] = React.useReducer((state: State, action: Action): State => {
    switch (action.type) {
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            }

        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            }

        case "DISMISS_TOAST": {
            const { toastId } = action

            // start dismiss animation
            if (toastId) addToRemoveQueue(toastId)
            else state.toasts.forEach((toast) => addToRemoveQueue(toast.id))

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId || toastId === undefined ? { ...t, open: false } : t
                ),
            }
        }

        case "REMOVE_TOAST":
            return {
                ...state,
            }
    }
}, { toasts: [] })

function toast(props: Omit<ToasterToast, "id">) {
    const id = genId()

    const update = (props: ToasterToast) =>
        dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } })
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
        },
    })

    return {
        id,
        dismiss,
        update,
    }
}

function useToast() {
    return {
        ...state,
        toast,
        dismiss: (toastId?: string) =>
            dispatch({ type: "DISMISS_TOAST", toastId }),
    }
}

export { useToast, toast }
