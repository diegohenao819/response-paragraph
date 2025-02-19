import React from "react";
import Image from "next/image";
import Expressions from "../../public/pictures/expressions.png"; // Verifica que la imagen esté en esta ruta

const Page = () => {
  return (
<div>
      <Image
        src={Expressions}
        alt="Expressions illustration"
        width={700} // Ajusta el tamaño según necesites
        height={500}
      />
</div>
  );
};

export default Page;
