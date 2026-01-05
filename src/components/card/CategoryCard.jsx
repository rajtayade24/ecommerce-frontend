import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

const placeholderImage = 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1200&auto=format&fit=crop';

export default function CategoryCard({ category }) {
  const navigate = useNavigate();

  const handleNavigate = (slug) => {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);

    navigate(`/products?${params.toString()}`);
  };

  console.log(category);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl border overflow-hidden hover-lift"
    >
      <div onClick={() => handleNavigate(category.slug)} className="block">
        <div className="relative aspect-video bg-muted overflow-hidden">
          <img
            src={category.image || placeholderImage}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute left-3 top-3">
            <Badge className="px-2 py-1">Category</Badge>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 capitalize">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{category.description}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {/* If you later add a productCount on the backend, show it here. */}
              Created: {new Date(category.createdAt).toLocaleDateString()}
            </div>

            <Button size="sm">View</Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}