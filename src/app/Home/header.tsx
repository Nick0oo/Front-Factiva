import Link from "next/link";
import LoginButton from "@/components/ui/loginButton"; // Importa el componente loginButton

export default function Header() {
  return (
    <header className="w-full bg-header text-foreground shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-3">
        {/* Logo */}
        <div className="text-3xl font-semibold">
          <Link href="/" className="text-white transition-colors">
            FACTIVA
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex space-x-12 font-semibold ml-auto text-gray-300">
          <Link
            href="#home"
            className="relative hover:text-white hover:bg-gray-500/20 hover:rounded-full transition-all px-4 py-2"
          >
            Inicio
          </Link>
          <Link
            href="#about"
            className="relative hover:text-white hover:bg-gray-500/20 hover:rounded-full transition-all px-4 py-2"
          >
            Acerca de
          </Link>
          <Link
            href="#services"
            className="relative hover:text-white hover:bg-gray-500/20 hover:rounded-full transition-all px-4 py-2"
          >
            Servicios
          </Link>
          <Link
            href="#contact"
            className="relative hover:text-white hover:bg-gray-500/20 hover:rounded-full transition-all px-4 py-2"
          >
            Contacto
          </Link>
        </nav>

        {/* Call to Action */}
        <div className="ml-6">
          <LoginButton href="/Login">Iniciar Sesión</LoginButton>
        </div>
      </div>
    </header>
  );
}
