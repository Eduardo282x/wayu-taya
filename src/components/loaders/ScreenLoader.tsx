import { createPortal } from "react-dom"
import { Loading } from "./Loading"

export const ScreenLoader = () => {
    return createPortal(
        <div className='fixed inset-0 z-[100] bg-gray-800 opacity-80 overflow-hidden flex items-center justify-center'>
            <Loading></Loading>
        </div>,
        document.body
    )
}
