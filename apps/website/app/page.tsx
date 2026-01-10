import {
  Header,
  Hero,
  ProblemSolution,
  Features,
  QuickStart,
  Installation,
  Examples,
  Comparison,
  Footer,
} from '@/components/landing';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Hero />
      <ProblemSolution />
      <Features />
      <QuickStart />
      <Installation />
      <Examples />
      <Comparison />
      <Footer />
    </div>
  );
};

export default HomePage;
