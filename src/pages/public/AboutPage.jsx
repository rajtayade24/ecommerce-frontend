import React from 'react';
import { Users, Clock, Globe, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom'

export default function AboutPage({ companyName = 'FreshMart' }) {
  const highlights = [
    { label: 'Customers', value: '120k+', icon: Users },
    { label: 'Orders', value: '2.3M+', icon: Clock },
    { label: 'States', value: '12', icon: Globe },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-10">

      {/* Hero */}
      <section className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">About {companyName}</h1>
        <p className="text-lg text-slate-600 mb-6">
          {companyName} is a digital platform that makes fresh, local groceries easy to buy by connecting customers directly with trusted farms and suppliers.
        </p>

        <ul className="space-y-3">
          {[
            'Locally sourced, quality-checked produce',
            'Fast delivery via local hubs',
            'Transparent pricing and origins',
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-slate-700">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Button>
            <Link
              to="/products"
            >
              Start shopping
            </Link >
          </Button>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {highlights.map((h, i) => {
          const Icon = h.icon;
          return (
            <Card key={i}>
              <CardContent className="flex items-center gap-4">
                <Icon className="w-6 h-6 text-indigo-600" />
                <div>
                  <div className="text-2xl font-semibold">{h.value}</div>
                  <div className="text-sm text-slate-500">{h.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

    </main>
  );
}




// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Check, Users, Clock, Globe } from 'lucide-react';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion';
// import { toast } from '@/components/ui/Sonner';

// export default function AboutPage({ companyName = 'FreshMart' }) {
//   const [email, setEmail] = useState('');
//   const [sent, setSent] = useState(false);

//   const stats = [
//     { id: 1, label: 'Customers served', value: '120k+', icon: Users },
//     { id: 2, label: 'Orders delivered', value: '2.3M+', icon: Clock },
//     { id: 3, label: 'States in India', value: '12', icon: Globe },
//   ];

//   const team = [
//     { id: 1, name: 'Asha Patel', role: 'CEO', bio: 'Ex-retailer, now building better grocery experiences.', avatar: 'https://i.pravatar.cc/150?img=47' },
//     { id: 2, name: 'Rahul Mehra', role: 'CTO', bio: 'Scales systems so you never lose your cart.', avatar: 'https://i.pravatar.cc/150?img=12' },
//     { id: 3, name: 'Maya Singh', role: 'Head of Ops', bio: 'Runs logistics with empathy and smarts.', avatar: 'https://i.pravatar.cc/150?img=24' },
//   ];

//   const timeline = [
//     { year: '2019', title: 'Founded', text: `Founded ${companyName} with a small team and big dreams.` },
//     { year: '2020', title: 'Seed round', text: 'Raised seed funding to build the first 5 city pilots.' },
//     { year: '2022', title: 'National launch', text: 'Expanded to 100+ cities with local farms partnerships.' },
//     { year: '2024', title: 'Sustainability push', text: 'Zero-plastic packaging experiments live.' },
//   ];

//   const faqs = [
//     { q: 'Where do your products come from?', a: 'We partner with local farms and trusted suppliers. Every product page lists origin and farm details when available.' },
//     { q: 'What is your return policy?', a: 'Perishable items: contact support within 24 hours with photos for speedy refunds.' },
//     { q: 'Do you support bulk orders for businesses?', a: 'Yes — we support marketplace and B2B orders. Reach out via the contact form.' },
//   ];

//   const testimonials = [
//     { id: 1, name: 'Karim', text: 'Fast delivery and amazing fresh produce — great experience!', avatar: 'https://i.pravatar.cc/100?img=56' },
//     { id: 2, name: 'Neha', text: 'Love the weekly boxes. High quality and well packed.', avatar: 'https://i.pravatar.cc/100?img=32' },
//   ];

//   const handleSubscribe = async (e) => {
//     e.preventDefault();
//     if (!email || !/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email)) {
//       toast.warning('Please enter a valid email');
//       return;
//     }
//     setSent(true);
//     setEmail('');
//     setTimeout(() => setSent(false), 3000);
//   };

//   return (
//     <main className="bg-background max-w-7xl mx-auto px-4 py-12 space-y-12">

//       {/* Hero */}
//       <section className="grid lg:grid-cols-2 gap-8 items-center">
//         <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
//           <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">About {companyName}</h1>
//           <p className="text-lg text-slate-600 mb-6">
//             We make fresh, local produce easier to buy — a platform that connects growers, small businesses, and communities through simple, sustainable commerce.
//           </p>

//           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {['Quality assured', 'Fast delivery'].map((feature, i) => (
//               <li key={i} className="flex items-start gap-3">
//                 <span className="p-2 bg-green-100 rounded-full"><Check className="w-4 h-4 text-green-700" /></span>
//                 <div>
//                   <div className="font-semibold">{feature}</div>
//                   <div className="text-sm text-slate-500">{feature === 'Quality assured' ? 'Sourced & inspected by experts.' : 'Cold-chain and local hubs for speed.'}</div>
//                 </div>
//               </li>
//             ))}
//           </ul>

//           <div className="mt-6 flex gap-3">
//             <Button>Get Started</Button>
//             <Button variant="outline">Contact Sales</Button>
//           </div>
//         </motion.div>

//         <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
//           <Card>
//             <CardContent className="grid grid-cols-3 gap-3">
//               {Array.from({ length: 6 }).map((_, i) => (
//                 <div key={i} className="h-24 w-full rounded-lg overflow-hidden">
//                   <img src={`https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80`} alt={`sample-${i}`} className="w-full h-full object-cover" />
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </section>

//       {/* Stats */}
//       <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//         {stats.map(stat => {
//           const Icon = stat.icon;
//           return (
//             <Card key={stat.id}>
//               <CardContent className="flex items-center gap-4">
//                 <div className="p-3 rounded-md bg-indigo-50">
//                   <Icon className="w-6 h-6 text-indigo-600" />
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold">{stat.value}</div>
//                   <div className="text-sm text-slate-500">{stat.label}</div>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </section>

//       {/* Timeline */}
//       <section>
//         <h2 className="text-2xl font-s  emibold mb-4">Our journey</h2>
//         <div className="bg-muted/30 border-l-2 border-slate-100 pl-6 space-y-8">
//           {timeline.map((t, idx) => (
//             <div key={idx} className="relative">
//               <div className="absolute -left-4 top-1 bg-white rounded-full p-1 shadow"><span className="w-3 h-3 bg-indigo-600 rounded-full block"></span></div>
//               <div className="text-sm text-slate-400">{t.year}</div>
//               <div className="font-semibold">{t.title}</div>
//               <div className="text-sm text-slate-600 mt-1">{t.text}</div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Team */}
//       <section>
//         <h2 className="text-2xl font-semibold mb-4">Meet the team</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//           {team.map(member => (
//             <Card key={member.id}>
//               <CardContent className="text-center">
//                 <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-lg mx-auto mb-3 object-cover" />
//                 <CardTitle className="text-lg">{member.name}</CardTitle>
//                 <CardDescription className="text-sm text-slate-500 mb-2">{member.role}</CardDescription>
//                 <p className="text-sm text-slate-600">{member.bio}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* Testimonials & FAQ */}
//       <section className="grid lg:grid-cols-2 gap-6">
//         <div>
//           <h3 className="text-xl font-semibold mb-4">What customers say</h3>
//           <div className="space-y-4">
//             {testimonials.map(t => (
//               <Card key={t.id}>
//                 <CardContent className="flex items-start gap-3">
//                   <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
//                   <div>
//                     <CardTitle className="text-sm font-semibold">{t.name}</CardTitle>
//                     <CardDescription className="text-sm text-slate-600">{t.text}</CardDescription>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h3 className="text-xl font-semibold mb-4">Frequently asked</h3>
//           <div className="space-y-3">
//             <Accordion
//               type="single"
//               collapsible
//               className="w-full"
//               defaultValue="item-1"
//             >
//               {faqs.map((f, i) => (
//                 <AccordionItem key={i} value={`item-${i}`}>
//                   <AccordionTrigger>{f.q}</AccordionTrigger>
//                   <AccordionContent className="flex flex-col gap-4 text-balance">
//                     <p>{f.a}</p>
//                   </AccordionContent>
//                 </AccordionItem>
//               ))}
//             </Accordion>
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section>
//         <Card className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">
//           <div>
//             <h3 className="text-2xl font-semibold mb-2">Stay in the loop</h3>
//             <p className="text-sm text-slate-600 mb-3">Subscribe for product updates, recipes, and member-only offers.</p>
//           </div>

//           <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
//             <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="min-w-[240px]" />
//             <Button type="submit">{sent ? 'Subscribed' : 'Subscribe'}</Button>
//           </form>
//         </Card>
//       </section>
//     </main>
//   );
// }
