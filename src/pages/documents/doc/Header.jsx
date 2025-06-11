export function HeaderPages({ title, Icon }) {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center gap-2">
        {Icon && <Icon size={24} />}
        <h1 className="text-xl font-medium">{title}</h1>
      </div>
    </header>
  )
}
