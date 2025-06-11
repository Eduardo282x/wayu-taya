import type React from "react"
import { Droplet, FileText, Music, Apple } from "lucide-react"
import { Link } from "react-router"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header with logo */}
      <header className="w-full bg-[#5BA7BC] p-4">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-lg bg-[#8CCCE2] p-8 text-center">
            <div className="flex items-center justify-center">
              <img src="/logo.png" alt="Fundación Wayuu Taya Logo" width={80} height={80} className="mr-4" />
              <h1 className="text-2xl font-bold text-[#333333] md:text-4xl">
                FUNDACIÓN
                <div className="mt-1 border-b-2 border-t-2 border-[#333333] text-3xl md:text-5xl">WAYUU TAYA</div>
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl p-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Agua Card */}
          <CategoryCard
            title="Agua"
            description="Control y administración del agua"
            icon={<Droplet size={48} className="text-white" />}
            buttonText="Acceder"
          />

          {/* Salud Card */}
          <CategoryCard
            title="Salud"
            description="actividades y recursos destinados al campo de salud"
            icon={
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-[#8CCCE2]">
                <div className="relative h-10 w-10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-6 w-6 rounded-full bg-[#8CCCE2]" />
                  </div>
                  <div className="absolute inset-0">
                    <div className="flex h-full items-center justify-center">
                      <div className="h-10 w-2 rounded-sm bg-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0">
                    <div className="flex h-full items-center justify-center">
                      <div className="h-2 w-10 rounded-sm bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            }
            buttonText="Salud"
          />

          {/* Documentos Card */}
          <CategoryCard
            title="Documentos"
            description="administración de archivos de la fundación"
            icon={<FileText size={48} className="text-white" />}
            buttonText="Documentos"
          />

          {/* Musica Card */}
          <CategoryCard
            title="Musica"
            description="actividades y eventos relacionados a la música"
            icon={<Music size={48} className="text-white" />}
            buttonText="Musica"
            className="col-span-1 md:col-span-1 lg:col-span-1 md:col-start-1 lg:col-start-2"
          />

          {/* Comida Card */}
          <CategoryCard
            title="Comida"
            description="administración de insumos y comida en las diferentes regiones"
            icon={<Apple size={48} className="text-white" />}
            buttonText="Comida"
            className="col-span-1 md:col-span-1 lg:col-span-1 md:col-start-2 lg:col-start-3"
          />
        </div>
      </main>
    </div>
  )
}

interface CategoryCardProps {
  title: string
  description: string
  icon: React.ReactNode
  buttonText: string
  className?: string
}

function CategoryCard({ title, description, icon, buttonText, className = "" }: CategoryCardProps) {
  return (
    <div className={`rounded-lg bg-[#8CCCE2] p-6 ${className}`}>
      <div className="mb-4 flex items-start">
        <div className="mr-4">{icon}</div>
        <div>
          <h2 className="text-3xl font-light text-white">{title}</h2>
          <p className="text-sm text-white">{description}</p>
        </div>
      </div>
      <div className="mt-8">
        <Link
          to="#"
          className="block rounded-md bg-[#39A9D3] py-3 text-center font-medium text-white shadow-md transition-colors hover:bg-[#2D8CAF]"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  )
}
