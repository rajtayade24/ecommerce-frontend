import React, { useState } from 'react';
import { Mail, Twitter, Instagram, Github, Phone, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const currentYear = new Date().getFullYear();

  // const handleSubscribe = async (e) => {
  //   e.preventDefault();
  //   if (!email || !/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email)) {
  //     alert('Please enter a valid email');
  //     return;
  //   }
  //   try {
  //     setLoading(true);
  //     // replace with your real endpoint
  //     await fetch('/api/newsletter/subscribe', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email }),
  //     });
  //     setSent(true);
  //     setEmail('');
  //   } catch (err) {
  //     console.error(err);
  //     alert('Subscription failed — try again later.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand + short */}
          <div className="space-y-4">

            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg group-hover:shadow-[var(--shadow-soft)] transition-all">
                <Leaf className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:inline-block">
                FreshMart
              </span>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm">Fresh groceries — delivered fast. Thoughtfully sourced, sustainably packed, and brought to your door.</p>

            <div className="flex items-center gap-3 mt-3">
              <Link aria-label="Twitter" to="#" className="p-2 rounded-md hover:bg-slate-800">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link aria-label="Instagram" to="#" className="p-2 rounded-md hover:bg-slate-800">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link aria-label="GitHub" to="#" className="p-2 rounded-md hover:bg-slate-800">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-semibold mb-3">Shop</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/products" className="hover:text-white">Products</Link></li>
                <li><Link to="/categories" className="hover:text-white">Categories</Link></li>
                <li><Link to="/offers" className="hover:text-white">Offers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Help</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/help" className="hover:text-white">Support</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/faqs" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Join our newsletter</h4>
            <p className="text-sm text-slate-400 mb-4">Weekly deals, seasonal picks, and recipes — straight to your inbox.</p>

            {/* <form onSubmit={handleSubscribe} className="flex gap-2">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                className="flex-1 rounded-md bg-slate-800 placeholder:text-slate-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}  
                required
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2"
                disabled={loading || sent}
              >
                {loading ? 'Saving...' : sent ? 'Subscribed' : 'Subscribe'}
              </Button>
            </form> */}

            <div className="mt-6 text-sm text-slate-400 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <div>
                <div>+91 98765 43210</div>
                <div className="text-xs">support@FreshMart.com</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <div>© {currentYear} FreshMart. All rights reserved.</div>
          <div className="flex items-center gap-4 mt-3 md:mt-0">
            <Link to="/term-service" className="hover:text-white">Terms & Services</Link>
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/sitemap.xml" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
