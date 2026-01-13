import React, { useState } from "react";
import { motion } from "framer-motion";

// shadcn/ui components (adjust paths if your project structure differs)
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/ScrollArea";

export default function TermsAndServices({
  companyName = "YourStoreName",
  lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
}) {
  const [agreed, setAgreed] = useState(false);

  const sections = [
    { id: "intro", title: "Introduction" },
    { id: "acceptance", title: "Acceptance of Terms" },
    { id: "use", title: "Using Our Services" },
    { id: "products", title: "Products, Pricing & Orders" },
    { id: "returns", title: "Returns & Refunds" },
    { id: "intellectual", title: "Intellectual Property" },
    { id: "disclaimer", title: "Disclaimer & Limitation of Liability" },
    { id: "privacy", title: "Privacy" },
    { id: "changes", title: "Changes to Terms" },
    { id: "contact", title: "Contact" },
  ];

  return (
    <motion.main
      className="container mx-auto p-4 md:p-12"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left column: Card with TOC */}
        <aside className="lg:col-span-1">
          <Card className="sticky top-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Terms & Services</CardTitle>
              <p className="text-sm text-muted-foreground">{companyName} — Last updated {lastUpdated}</p>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">Quick navigation</p>

              <nav aria-label="Table of contents">
                <ul className="space-y-2 text-sm">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block rounded-md px-2 py-1 hover:bg-muted"
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(s.id);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <Separator className="my-4" />

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.print()}>
                  Print
                </Button>
                <Button onClick={() => {
                  // simple 'agree' flow — in a real checkout you'd gate actions server-side
                  setAgreed(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}>
                  {agreed ? "Agreed ✅" : "Agree"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Right column: Terms content */}
        <article className="prose lg:prose-lg lg:col-span-3 max-w-none">
          <header className="mb-6">
            <h1 className="text-3xl font-semibold">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">These terms govern your use of {companyName}. Please read them carefully.</p>
          </header>

          <ScrollArea className="max-h-[70vh] pr-4">
            <section id="intro" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
                <h2>Introduction</h2>
                <p>
                  Welcome to {companyName}. By accessing or using our services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree with these Terms, please do not use our services.
                </p>
              </motion.div>
            </section>

            <section id="acceptance" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <h2>Acceptance of Terms</h2>
                <p>
                  These Terms constitute a legally binding agreement between you and {companyName}. You represent that you are at least 18 years old and capable of entering into binding agreements.
                </p>
              </motion.div>
            </section>

            <section id="use" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <h2>Using Our Services</h2>
                <p>
                  You agree to use our services only for lawful purposes and in accordance with these Terms. You must not use our platform to transmit unlawful, abusive, or infringing content.
                </p>
                <Accordion type="single" collapsible>
                  <AccordionItem value="account">
                    <AccordionTrigger className="flex justify-between">
                      Account responsibilities
                      <ChevronDown />
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </section>

            <section id="products" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 }}>
                <h2>Products, Pricing & Orders</h2>
                <p>
                  Product descriptions and prices are subject to change. We take reasonable care to display accurate product information, but we do not warrant that the information is error-free. In case of pricing errors, {companyName} reserves the right to cancel orders.
                </p>
              </motion.div>
            </section>

            <section id="returns" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.21 }}>
                <h2>Returns & Refunds</h2>
                <p>
                  Our returns and refunds policy is available on the Returns page. Short summary: contact support within the stated window, provide proof of purchase, and follow the instructions for returns.
                </p>
              </motion.div>
            </section>

            <section id="intellectual" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.24 }}>
                <h2>Intellectual Property</h2>
                <p>
                  All content on this site, including text, graphics, logos, and images, is the property of {companyName} or its licensors and is protected by intellectual property laws.
                </p>
              </motion.div>
            </section>

            <section id="disclaimer" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.27 }}>
                <h2>Disclaimer & Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, {companyName} disclaims all warranties and limits liability for damages arising from use of the site. For purchases, any specific statutory rights you might have are not affected.
                </p>
              </motion.div>
            </section>

            <section id="privacy" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <h2>Privacy</h2>
                <p>
                  Our Privacy Policy explains how we collect, use, and share your personal information. By using the service you consent to that policy.
                </p>
              </motion.div>
            </section>

            <section id="changes" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.33 }}>
                <h2>Changes to Terms</h2>
                <p>
                  We may modify these Terms from time to time. We will post the new Terms with an updated "Last updated" date. Your continued use after changes constitutes acceptance of the new Terms.
                </p>
              </motion.div>
            </section>

            <section id="contact" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.36 }}>
                <h2>Contact</h2>
                <p>
                  Questions about these Terms should be sent to our support team at <a href="mailto:support@yourstore.com" className="underline">support@yourstore.com</a>.
                </p>
              </motion.div>
            </section>

            <footer className="mt-6 mb-16 text-sm text-muted-foreground">
              <p>
                These Terms constitute the entire agreement between you and {companyName} regarding the subject matter hereof.
              </p>
            </footer>
          </ScrollArea>
        </article>
      </div>

      {/* Floating accept banner for small screens */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: agreed ? 0 : 1 }}
        transition={{ duration: 0.35 }}
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(95%,900px)]`}
      >
        {!agreed && (
          <div className="rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-2xl border">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">By continuing, you agree to these Terms</p>
                <p className="text-sm text-muted-foreground">Last updated {lastUpdated}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>View</Button>
                <Button onClick={() => setAgreed(true)}>Agree</Button>
              </div>
            </div>
          </div>
        )}

        {agreed && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="rounded-2xl bg-emerald-50 p-3 border">
            <p className="text-sm">Thanks — you've agreed to the Terms. ✅</p>
          </motion.div>
        )}
      </motion.div>
    </motion.main>
  );
}
