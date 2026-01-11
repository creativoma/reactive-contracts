import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { ProblemSolution } from '@/components/landing/ProblemSolution';
import { TypeSafetyShowcase } from '@/components/landing/TypeSafetyShowcase';
import { Features } from '@/components/landing/Features';
import { QuickStart } from '@/components/landing/QuickStart';
import { Installation } from '@/components/landing/Installation';
import { Examples } from '@/components/landing/Examples';
import { Packages } from '@/components/landing/Packages';
import { Comparison } from '@/components/landing/Comparison';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Hero />
      <ProblemSolution />
      <TypeSafetyShowcase />
      <Features />
      <QuickStart />
      <Installation />
      <Examples />
      <Packages />
      <Comparison />
      <FAQ />
      <Footer />
    </div>
  );
};

export default HomePage;
