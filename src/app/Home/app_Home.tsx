import Footer from '@/app/Home/footer';
import Features from '@/components/features-2';
import Pricing from '@/components/pricing';
import HeroSection from '@/components/hero-section';
import FAQsTwo from '@/components/faqs-2';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-grow flex flex-col justify-start px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        <HeroSection />
        <section id="features">
          <Features />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <section id="faqs">
          <FAQsTwo />
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}