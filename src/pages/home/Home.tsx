import { Link, useNavigate } from "react-router";
import logo from '@/assets/img/logo.png';
import { CategoryCardProps, optionsMenu } from "./menu.data";
import toast from "react-hot-toast";
import { Snackbar } from "@/components/snackbar/Snackbar";
import { IoBuildOutline } from "react-icons/io5";

export default function Home() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login')
  }

  return (
    <div className="h-screen w-screen overflow-x-hidden bg-gradient-to-b from-blue-900 to-[#91d5ff] relative">
      {/* Header with logo */}
      <header className="w-full p-2">
        <div className="p-8 text-center flex items-center justify-center gap-8">
          <img src={logo} alt="Fundación Wayuu Taya Logo" width={100} height={100} className="mt-2 flex items-center justify-center object-contain" />
          <h1 className="text-2xl font-bold text-[#fff] md:text-3xl">
            FUNDACIÓN
            <div className="mt-1 border-b-2 border-t-2 border-[#fff] text-3xl md:text-5xl">WAYUU TAYA</div>
          </h1>
        </div>
      </header>


      {/* Main content */}
      <main className="mx-auto max-w-6xl p-4">
        <div className="flex flex-wrap justify-center items-start gap-8 w-full">

          {optionsMenu && optionsMenu.map((me: CategoryCardProps, index: number) => (
            <CategoryCard
              key={index}
              title={me.title}
              description={me.description}
              icon={me.icon}
              buttonText={me.buttonText}
              url={me.url}
              section={me.section}
              working={me.working}
              style={{
                animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                animationDelay: `${index * 0.03}s`
              }}
            />
          ))}
        </div>
      </main>

      <div className="fixed bottom-5 left-5">
        <button
          className="bg-red-600 text-white font-semibold py-2 px-4 rounded shadow cursor-pointer transition-colors  hover:bg-[#570206] duration-300"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

function CategoryCard({ title, description, icon: Icon, buttonText, url, section, style, working }: CategoryCardProps & { style?: React.CSSProperties }) {

  const setMenuLocal = (section: string) => {
    localStorage.setItem('menu', section)
  }

  const showAlert = () => {
    toast.custom(<Snackbar success={true} message={'Modulo en desarrollo...'} Icon={IoBuildOutline } className="bg-gray-600" />, {
      duration: 1500,
      position: 'bottom-center'
    });
  }
  return (
    <div
      className="rounded-lg shadow-xl bg-gray-200 border-2 border-blue-500 w-80 h-52 p-6"
      style={style}
      onClick={() => setMenuLocal(section)}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <Icon className="text-blue-500 size-14" />

        <div>
          <h2 className="text-3xl text-blue-500 font-semibold">{title}</h2>
          <p className="text-sm text-blue-500">{description}</p>
        </div>
      </div>

      <div className="mt-8">
        {!working ? (
          <Link
            to={url}
            className="block rounded-md bg-blue-500 py-3 text-center font-medium text-white shadow-md transition-colors hover:bg-[#3a4ea1] hover:text-white"
          >
            {buttonText}
          </Link>
        ) :
          <div
            onClick={showAlert}
            className="block rounded-md bg-blue-500 py-3 text-center font-medium text-white shadow-md transition-colors hover:bg-[#3a4ea1] hover:text-white"
          >
            {buttonText}
          </div>
        }
      </div>
    </div>
  )
}
