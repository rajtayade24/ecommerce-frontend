import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Sonner';
import { Star } from 'lucide-react';
import { postFeedback } from '@/service/userService';
import useAuthStore from '@/store/useAuthStore';
import UnAuthorizedUser from "@/pages/public/UnAuthorizedUser";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const starVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 }
};

export default function Feedback() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    rating: 0,
    productId: '',
  });

  const [hover, setHover] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitFeedback = async (e) => {
    e.preventDefault();

    if (formData.rating < 1) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setLoading(true);
      await postFeedback({
        productId: formData.productId || null,
        title: formData.title,
        message: formData.message,
        rating: formData.rating
      });

      toast.success('Thank you for your feedback ⭐');
      setFormData({ productId: '', title: '', message: '', rating: 0 });
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  if (!isAuthenticated) {
    return <UnAuthorizedUser />;
  }

  return (
    <motion.div
      className="max-w-lg mx-auto p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.form
        onSubmit={submitFeedback}
        className="bg-white rounded-2xl shadow-lg p-6 space-y-5"
        layout
      >
        <motion.h2
          className="text-2xl font-bold text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          We value your feedback
        </motion.h2>

        <Input
          name="title"
          placeholder="Feedback title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <Textarea
          name="message"
          placeholder="Write your feedback here..."
          value={formData.message}
          onChange={handleChange}
          rows={4}
          required
        />

        {/* Star Rating */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <motion.button
              type="button"
              key={value}
              variants={starVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setFormData({ ...formData, rating: value })}
            >
              <Star
                className={`h-7 w-7 transition-colors ${value <= (hover || formData.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
                  }`}
              />
            </motion.button>
          ))}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </motion.form>
    </motion.div>
  );
}
