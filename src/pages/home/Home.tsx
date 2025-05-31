import { Link } from "react-router";
import logo from '@/assets/img/logo.png';
import { CategoryCardProps, optionsMenu } from "./menu.data";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-r from-[#024dae] to-[#5cdee5]">
      {/* Header with logo */}
      <header className="w-full p-4">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-lg bg-[#0355b2] p-8 text-center">
            <div className="flex items-center justify-center">
              <img src={logo} alt="Fundación Wayuu Taya Logo" width={80} height={80} className="mr-4" />
              <h1 className="text-2xl font-bold text-[#fff] md:text-4xl">
                FUNDACIÓN
                <div className="mt-1 border-b-2 border-t-2 border-[#fff] text-3xl md:text-5xl">WAYUU TAYA</div>
              </h1>
            </div>
          </div>
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
            />
          ))}
        </div>
      </main>
    </div>
  )
}


function CategoryCard({ title, description, icon: Icon, buttonText, url }: CategoryCardProps) {
  return (
    <div className={`rounded-lg shadow-xl bg-linear-to-br to-[#024dae] from-[#5cdee5] w-80 h-48 p-6`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <Icon className="text-white size-14" />

        <div>
          <h2 className="text-3xl text-white font-semibold">{title}</h2>
          <p className="text-sm text-white">{description}</p>
        </div>
      </div>

      <div className="mt-8">
        <Link
          to={url}
          className="block rounded-md bg-[#39A9D3] py-3 text-center font-medium text-white shadow-md transition-colors hover:bg-[#2D8CAF]"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  )
}
