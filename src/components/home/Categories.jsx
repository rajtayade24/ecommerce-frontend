import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import categoryVegetables from "@/assets/category-vegetables.jpg";
import categoryFruits from "@/assets/category-fruits.jpg";
import categoryExotic from "@/assets/category-exotic.jpg";
import categoryOrganic from "@/assets/category-organic.jpg";
import { useCategory } from "@/hooks/useCategory";

export const Categories = () => {
  const {
    categories,
    isLoading,
    isError,
    error,
  } = useCategory()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>{error?.message}</div>

  return (
    <section className="py-4 sm:py-8 lg:py-16 bg-muted/30">
      <div className="container ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of fresh produce, carefully categorized for your convenience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/products?category=${category.slug}`}>
                <div className="group relative overflow-hidden rounded-2xl bg-card border hover-lift cursor-pointer">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {category.description}
                    </p>
                    {/* <p className="text-sm font-medium text-primary">
                      {category.count} products
                    </p> */}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
