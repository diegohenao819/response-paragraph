import React from "react";
import Image from "next/image";

const Page = () => {
  return (
    <div>
      <Image 
        src="/pictures/rubrics.png" 
        alt="Rubrics illustration"
        width={700}
        height={500}
      />
    </div>
  );
};

export default Page;
