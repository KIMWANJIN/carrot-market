// This file a hook (hook is like an useState) : it is a react component and it returns a function and a state which has a url parameter as a prop
// A function will fetch data from ui and POST it to server and than database will be mutated
// A state will be object of loading state, data and error

import { useState } from "react"

interface useMutationState<T> {
    loading: boolean;
    data?: T;
    error?: object;
}

type UseMutationResult<T> = [(data: any) => void, useMutationState<T>]

export default function useMutation<T = any>(url: string): UseMutationResult<T> {
    const [state, setState] = useState<useMutationState<T>>({loading: false, data: undefined, error: undefined})
    function mutation(data?: any) {
        setState((prev) => ({ ...prev, loading: true}))
        fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
            .then((response) => response.json().catch(() => {}))
            .then((data) => setState((prev) =>({ ...prev, data})))
            .catch((error) => setState((prev) => ({ ...prev, error})))
            .finally(() => setState((prev) => ({ ...prev, loading: false})))
    }
    return [mutation, { ...state }]
}
