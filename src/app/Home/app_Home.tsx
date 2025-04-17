import Footer from '@/app/Home/footer'; // Asegúrate de que el componente esté exportado con default
import Header from '@/app/Home/header'; // Asegúrate de que el componente esté exportado con default
import ContentSection from '@/app/Home/content'; // Asegúrate de que el componente esté exportado con default

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-grow flex flex-col justify-start px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        {/* Aquí puedes agregar contenido adicional si es necesario */}
        <ContentSection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}