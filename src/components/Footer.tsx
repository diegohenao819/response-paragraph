// src/components/Footer.tsx


export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-4 mt-8 border-t">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Diego Henao. All rights reserved.
          </p>
          <p className="text-sm">
            Professor, Upper-Intermediate English Course at Universidad Tecnológica de Pereira.
          </p>
        </div>
        <div className="flex gap-4 mt-2 md:mt-0">
          
        </div>
      </div>
    </footer>
  );
}
