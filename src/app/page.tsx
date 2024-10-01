import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div>
      <h1 className="text-center">
        Bienvenidos aqui sera la home de la startup Alcolabs{" "}
      </h1>
      <p className="text-center">Esta es la pagina de inicio</p>
      <Link href="about"></Link>
    </div>
  );
};

export default page;
