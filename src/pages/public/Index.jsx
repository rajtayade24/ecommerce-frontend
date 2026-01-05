// import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Features } from '@/components/home/Features';

const Index = () => (
  <div className="min-h-screen bg-background">
    <Hero />
    <Features />
    <Categories />
    <FeaturedProducts />
  </div>
);

export default Index;
