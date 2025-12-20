"use client"
import { Store } from "@/redux/Store"
import { ReactNode } from "react"
import { Provider } from "react-redux"

interface ProviderProps {
    children : ReactNode
}

export const Providers = ({children} : ProviderProps) => {
    return (
        <Provider store={Store}>
            {children}
        </Provider>
    )
}
