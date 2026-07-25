// import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/home/Hero';
import { TopCategories } from '@/components/home/TopCategories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Features } from '@/components/home/Features';

const Index = () => (
  <div className="min-h-screen bg-background">
    <Hero />
    <Features />
    <TopCategories />
    <FeaturedProducts />
  </div>
);

export default Index;
