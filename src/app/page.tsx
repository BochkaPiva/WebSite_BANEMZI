import LeadForm from './(components)/LeadForm';
import Header from './(components)/Header';
import { Services, Benefits, Process, FAQ, FinalCTA, Cities, DreamEventSection } from './(components)/Sections';
import Hero from './(components)/Hero';
import Footer from './(components)/Footer';

export default function Home() {
  return (
    <div className="min-h-screen text-white">
      <Header />
      <Hero />
      <DreamEventSection />
      <Benefits />
      <Process />
      <Cities />
      <FAQ />
      <FinalCTA />
      <section id="lead" className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <LeadForm />
      </section>
      <Footer />
    </div>
  );
}
