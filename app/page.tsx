import { HeartHandshake, Award, UserCircle, ShieldCheck } from "lucide-react";
import  Navbar from "../ui/Navbar";
import Footer from "../ui/footer";
export default function Home() {
  return (
    <main className="bg-blue-50">
      <Navbar />
      {/* SECTION HERO */}
      <section id="Inicio" className="min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-700 leading-tight">
              ¡Sonríe con confianza,<br />nosotros te ayudamos!
            </h1>
            <p className="mt-4 text-gray-600">
              Cuidamos de tu salud dental con atención profesional y personalizada.
            </p>
            <div className="mt-6 flex gap-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                Agendar Cita
              </button>
              <button className="border border-blue-600 text-black px-6 py-2 rounded-lg hover:bg-blue-100 transition">
                Saber Más
              </button>
            </div>
          </div>

          <img
            className="w-full max-w-md mx-auto rounded-lg shadow-lg"
            src="https://tse4.mm.bing.net/th/id/OIP.vn48JvzNPp7mB8XHxXNsugHaE8"
            alt="Dentista"
          />
        </div>
      </section>

      
      <section id="Equipo" className="bg-slate-50 py-20 text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-10">
          Nuestro Dentista
        </h2>
        
        <div className="max-w-sm mx-auto bg-zinc-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex flex-col items-center max-w-xl mx-auto px-6">
          <img
            src= "../public/doctor.webp"
            alt="DRA"
            className="w-48 h-48 rounded-full object-cover shadow-lg mb-6"
          />
          <h3 className="text-2xl font-semibold text-gray-800">
            DR.
          </h3>
          <p className="text-gray-600 mb-4">
            Especialista en Ortodoncia y Estética Dental
          </p>
          <p className="text-gray-700 max-w-md">
            Con más de 10 años de experiencia, brindando calidad en cada tratamiento,
            enfocado siempre en la comodidad y satisfacción del paciente.
          </p>
        </div>
        </div>
      </section>

    <section id="Nosotros" className="bg-slate-50 py-0 text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-10">Misión y Visión</h2>

  <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10">
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
      <h3 className="text-2xl font-bold text-blue-700 mb-6">Nuestra Misión</h3>
      <p className="text-gray-700">
        Somos una clínica especializada en el cuidado dental, brindando la mejor calidad de tratamiento para nuestros pacientes.
      </p>
    </div>

    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
      <h3 className="text-2xl font-bold text-blue-700 mb-6">Nuestra Visión</h3>
      <p className="text-gray-700">
        Ser una de las clínicas dentales con los mejores servicios en Managua, reconocidos por nuestra excelencia.
      </p>
    </div>

  </div>
    
  <h2 className="mt-20 text-3xl font-bold text-blue-800 mb-10">Nuestros valores fundamentales</h2>
  <div className=" max-w-6xl mx-auto px-5 grid md:grid-cols-4 gap-10">
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex flex-col items-center max-w-xl mx-auto px-6">
          <HeartHandshake className="w-12 h-12 text-blue-600"></HeartHandshake>  
            <h3 className="text-2xl font-bold text-blue-700 mb-6">Atencion compasiva</h3>
        </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex flex-col items-center max-w-xl mx-auto px-6">
           <Award className="w-12 h-12 text-blue-600" />
          </div>  
            <h3 className="text-2xl font-bold text-blue-700 mb-6">Excelencia</h3>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex flex-col items-center max-w-xl mx-auto px-6">
            <UserCircle className="w-12 h-12 text-blue-600" />

          </div>  
            <h3 className="text-2xl font-bold text-blue-700 mb-6">Centrado en el paciente</h3>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex flex-col items-center max-w-xl mx-auto px-6">
            <ShieldCheck className="w-12 h-12 text-blue-600" />

          </div>  
            <h3 className="text-2xl font-bold text-blue-700 mb-6">Transparencia</h3>
        </div>
    </div>
    </section>

    <section id="Atencion" className="bg-slate-50 py-0 text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-10 mt-16">Horario de atencion</h2>
        <p className="font-bold text-blue-700">Con gusto le atenderemos en los horarios disponible para mas informacion contactenos</p>

    <div className="max-w-5xl mx-auto px-6  items-center gap-10 mt-5">
        <div className="bg-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-blue-700 mb-6">Horarios</h3>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl grid md:grid-cols-2 transition-shadow m-px mb-3">
                <p className="text-left text-black">Lunes a viernes: </p> <h1 className="text-right text-blue-700">8:00AM - 5:00PM</h1>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl grid md:grid-cols-2 transition-shadow m-px mb-3">
                <p className="text-left text-black">Sabado: </p> <h1 className="text-right text-blue-700">9:00AM - 2:00PM</h1>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl grid md:grid-cols-2 transition-shadow m-px mb-3">
                <p className="text-left text-black">Domingo: </p> <h1 className="text-right text-blue-700">Cerrado</h1>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow m-px mb-3">
                <button className=" bg-blue-600 px-4 py-1 rounded-lg text-white font-bold">
                    Agendar Cita
                </button> 
            </div>
            <h2 className="text-center">Reserva online disponible 24/7</h2>
        </div>
    </div>
    
    
    
    </section>

    <Footer/>
    </main>
  );
}

