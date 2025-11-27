import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 text-center">
      <p>&copy; </p>
      <div className="mt-2">
        <a href="/about" className="mx-2 hover:underline">Sobre Nosotros</a>
        <a href="/contact" className="mx-2 hover:underline">Contacto</a>
        <a href="/privacy" className="mx-2 hover:underline">Privacidad</a>
      </div>
    </footer>
  );
};

export default Footer;
