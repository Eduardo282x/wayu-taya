import { Link, useNavigate } from "react-router";
import logo from '@/assets/img/logo.png';
import { CategoryCardProps, optionsMenu } from "./menu.data";

export default function Home() {
  const navigate= useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-[#91d5ff]">
      {/* Header with logo */}
      <header className="w-full p-2">
        <div className="mx-auto max-w-8xl flex items-center justify-between">
          <div className="w-32"></div>
          {/* Logo y título centrados */}
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <img src={logo} alt="Fundación Wayuu Taya Logo" width={80} height={80} className="mb-2" />
            <h1 className="text-2xl font-bold text-[#fff] md:text-3xl">
              FUNDACIÓN
              <div className="mt-1 border-b-2 border-t-2 border-[#fff] text-3xl md:text-5xl">WAYUU TAYA</div>
            </h1>
          </div>
          <button
            className="bg-red-600 text-white font-semibold py-2 px-4 rounded shadow cursor-pointer transition-colors  hover:bg-[#570206] duration-300"
            onClick={() => navigate('/login')}

          >
            Cerrar sesión
          </button>
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
            />
          ))}
        </div>
      </main>
    </div>
  )
}

function CategoryCard({ title, description, icon: Icon, buttonText, url }: CategoryCardProps) {
  return (
    <div className={`rounded-lg shadow-xl bg-gray-200 border-2 border-blue-500 w-80 h-52 p-6`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <Icon className="text-blue-500 size-14" />

        <div>
          <h2 className="text-3xl text-blue-500 font-semibold">{title}</h2>
          <p className="text-sm text-blue-500">{description}</p>
        </div>
      </div>

      <div className="mt-8">
        <Link
          to={url}
          className="block rounded-md bg-blue-500 py-3 text-center font-medium text-white shadow-md transition-colors hover:bg-[#3a4ea1] hover:text-white"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  )
}
