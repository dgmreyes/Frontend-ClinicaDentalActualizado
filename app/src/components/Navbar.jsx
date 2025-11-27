import { useState } from "react";


export default function Navbar() {
    const scrollSection = (sectionId) => {
        document.getElementById(sectionId).scrollIntoView({
            behavior: "smooth"
        })
    }
  const [open, setOpen] = useState(false);
  const handleClick = () => {window.location.href = "/src/pages/Dashboard" };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <h2 className="text-xl font-bold text-blue-600">
          Clínica Dental
        </h2>
        
        <ul className="hidden md:flex gap-8 text-gray-700">
          <li><button  
          onClick={()=> scrollSection("Inicio")}>Inicio</button></li>
          <li><button onClick={()=> scrollSection("Nosotros")}>Sobre Nosotros</button></li>
          <li><button onClick={()=> scrollSection("Atencion")}>Servicios</button></li>
          <li><button onClick={()=> scrollSection("Equipo")}>Nuestro Equipo</button></li>
        </ul>

        {/* Botones */}
        <div className="hidden md:flex gap-3">
          <button className="border border-blue-600 px-4 py-1 rounded-lg text-blue-600">
            Agendar Cita
          </button>
          <button onClick={handleClick}  className="bg-blue-600 text-white px-4 py-1 rounded-lg">
            Iniciar Sesión 
          </button>
        </div>

        {/* Menu Hamburguesa */}
        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      
      {open && (
        <div className="md:hidden bg-white px-6 pb-4">
          <ul className="flex flex-col gap-4 text-gray-700">
            <li><a href="/">Inicio</a></li>
            <li><a href="/about">Sobre Nosotros</a></li>
            <li><a href="/services">Servicios</a></li>
            <li><a href="/team">Nuestro Equipo</a></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
