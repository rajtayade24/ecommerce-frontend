import { motion } from "framer-motion";
import { Truck, Shield, Leaf, Clock } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On orders over ₹99",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "100% fresh or refund",
    color: "text-secondary",
  },
  {
    icon: Leaf,
    title: "Organic Options",
    description: "Certified organic produce",
    color: "text-primary",
  },
  {
    icon: Clock,
    title: "Same Day Delivery",
    description: "Order before 2 PM",
    color: "text-accent",
  },
];

export const Features = () => {
  return (
    <section className="py-4 sm:py-8 lg:py-16 bg-card border-y">
      <div className="container ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * .15 }}
              className="flex flex-col items-center text-center group"
            >
              <div
                className={`${feature.color} mb-4 p-4 bg-muted rounded-full group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
