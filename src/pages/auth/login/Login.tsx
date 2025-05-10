import logo from '../../../assets/img/logo .png'
import { LoginForm } from './LoginForm'

export const Login = () => {
    return (
        <div className="bg-gradient-to-tr from-[#3449D5] to-[#34A8D5] h-screen flex items-center justify-center font-sans">
            <div className="bg-white rounded-2xl shadow-2xl lg:w-full lg:max-w-4xl w-60 h-[70%] lg:h-[30rem] flex overflow-hidden">
                <div className="lg:w-1/2 w-full bg-gray-100 p-4 ">
                    {/* Lado izquierdo - Formulario */}
                    <div className="flex items-center w-full cursor-default -mb-3">
                        <img src={logo} alt="logo" className='w-12 m-2 lg:w-20 lg:h-20 drop-shadow-gray-500 drop-shadow-lg' />
                        <div className="lg:ml-2 text-[1rem] mr-2 julius-sans-one-regular lg:text-[2.5rem]  text-[#34A8D5] text-shadow2 ">WAYUU TAYA</div>
                    </div>

                    <div className="text-center cursor-default mb-4 space-y-3 text-[0.78rem]">
                        <div className="text-[#34A8D5] manrope lg:text-xl mb-1">¡Bienvenido!</div>
                        <div className="text-gray-500 manrope lg:text-xl opacity-70 ml-1">Ingresa tus datos....</div>
                    </div>

                    <LoginForm />
                </div>

                {/* Lado derecho - logo grande */}
                <div className="w-1/2 p-8 bg-[#3449D5] rounded-xl lg:flex flex-wrap items-center justify-start text-black hidden">
                    <img src={logo} alt="" className='w-20 h-20 mt-[3rem] drop-shadow-black drop-shadow-lg' />
                    <div className='flex flex-col text-center cursor-default'>
                        <span className='oswald font-normal text-4xl'>FUNDACIÓN</span>
                        <span className='julius-sans-one-regular text-[2.5rem] border-y-2 border-black'>WAYUU TAYA</span>
                    </div>
                </div>
            </div>
        </div>

    )
}
