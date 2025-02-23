import Image from "next/image";
import Rubrics from "../../public/pictures/rubrics.png"; // Verifica que la imagen esté en esta ruta

const Page = () => {
  return (
    <div>
      <h2>Rubrics - 2024</h2>
      <Image
        src={Rubrics}
        alt="Rubrics illustration"
        width={700}
        height={500}
      />
    </div>
  );
};

export default Page;
