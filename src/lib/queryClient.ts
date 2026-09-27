import { QueryClient } from "@tanstack/react-query"

/** Estados en los que reintentar es inútil o contraproducente. */
const NO_RETRY_STATUS = new Set([401, 403, 429])

const statusOf = (error: unknown): number | undefined => {
    const candidate = error as { status?: unknown; response?: { status?: unknown } } | null
    const status = candidate?.response?.status ?? candidate?.status
    return typeof status === "number" ? status : undefined
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            /**
             * Reintentar un 403 es inutil (el rol no va a cambiar) y un 429
             * agrava el limite. Un 401 lo resuelve el interceptor de respuesta
             * con su propio refresh: si llega aqui, ya se reintento una vez.
             */
            retry: (failureCount, error) => {
                const status = statusOf(error)
                if (status !== undefined && NO_RETRY_STATUS.has(status)) return false
                return failureCount < 2
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
            staleTime: 5 * 60 * 1000, // 5 minutos
            gcTime: 10 * 60 * 1000, // 10 minutos
            // Sin polling agresivo: solo se refetchea al reconectar.
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            // Escribir dos veces un POST con un 403 o un 429 empeora la situacion.
            retry: 0,
        },
    },
})
