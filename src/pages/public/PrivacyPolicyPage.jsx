import React, { useState } from "react";
import { motion } from "framer-motion";

// shadcn/ui components — adjust imports to your project layout
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { Badge } from "@/components/ui/Badge";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/ScrollArea";


export default function PrivacyPolicyPage({
  companyName = "YourStoreName",
  contactEmail = "privacy@yourstore.com",
  lastUpdated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
}) {
  const [acceptedCookies, setAcceptedCookies] = useState(false);

  const sections = [
    { id: "intro", title: "Introduction" },
    { id: "data", title: "Information We Collect" },
    { id: "how-we-use", title: "How We Use Your Information" },
    { id: "cookies", title: "Cookies & Tracking" },
    { id: "sharing", title: "Sharing & Third Parties" },
    { id: "security", title: "Security" },
    { id: "rights", title: "Your Rights" },
    { id: "retention", title: "Data Retention" },
    { id: "international", title: "International Transfers" },
    { id: "children", title: "Children's Privacy" },
    { id: "changes", title: "Changes to this Policy" },
    { id: "contact", title: "Contact Us" },
  ];

  return (
    <motion.main className="container mx-auto p-6 md:p-12" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <Card className="sticky top-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Privacy Policy</CardTitle>
              <p className="text-sm text-muted-foreground">{companyName} — Last updated {lastUpdated}</p>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm">Quick links</p>
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
                <Button variant="outline" onClick={() => window.print()}>Print</Button>
                <Button onClick={() => navigator.clipboard?.writeText(window.location.href)}>Copy Link</Button>
              </div>
            </CardContent>
          </Card>
        </aside>

        <article className="prose lg:prose-lg lg:col-span-3 max-w-none">
          <header className="mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold">Privacy Policy</h1>
              <Badge variant="secondary">Effective</Badge>
            </div>
            <p className="text-sm text-muted-foreground">This policy explains how {companyName} collects, uses, and shares your personal information.</p>
          </header>

          <ScrollArea className="max-h-[70vh] pr-4">
            <section id="intro" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 }}>
                <h2>Introduction</h2>
                <p>
                  {companyName} respects your privacy. By using our website and services you consent to the collection and use of information as described in this policy.
                </p>
              </motion.div>
            </section>

            <section id="data" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 }}>
                <h2>Information We Collect</h2>
                <p>We may collect:</p>
                <ul>
                  <li>Contact and account information (name, email, shipping address)</li>
                  <li>Payment and transactional data (payment method, order details)</li>
                  <li>Device and usage information (IP address, browser, analytics)</li>
                  <li>Customer support communications</li>
                </ul>
              </motion.div>
            </section>

            <section id="how-we-use" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.09 }}>
                <h2>How We Use Your Information</h2>
                <p>We use personal data to:</p>
                <ul>
                  <li>Process orders and provide services</li>
                  <li>Communicate about orders, offers, and updates</li>
                  <li>Detect fraud and protect our services</li>
                  <li>Improve and personalize the shopping experience</li>
                </ul>
              </motion.div>
            </section>

            <section id="cookies" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}>
                <h2>Cookies & Tracking</h2>
                <p>
                  We use cookies and similar technologies for functionality, analytics, and advertising. You can control cookie preferences through your browser or the cookie controls on the site.
                </p>
                <Accordion type="single" collapsible>
                  <AccordionItem value="types">
                    <AccordionTrigger className="flex justify-between">
                      Cookie types
                      <ChevronDown />
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        <strong>Essential:</strong> required for core site functionality. <br />
                        <strong>Analytics:</strong> help us understand usage and improve the site. <br />
                        <strong>Marketing:</strong> used to show relevant ads on and off our site.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </section>

            <section id="sharing" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <h2>Sharing & Third Parties</h2>
                <p>
                  We may share data with service providers (fulfillment, payments, analytics) and as required by law. We do not sell personal information for advertising purposes.
                </p>
              </motion.div>
            </section>

            <section id="security" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 }}>
                <h2>Security</h2>
                <p>
                  We implement administrative, technical, and physical safeguards designed to protect personal information. However, no system is completely secure—if you suspect a breach, contact us immediately.
                </p>
              </motion.div>
            </section>

            <section id="rights" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.21 }}>
                <h2>Your Rights</h2>
                <p>
                  Depending on your jurisdiction you may have rights to access, correct, delete, or export your personal data, and to object to or restrict processing. To exercise rights, contact us at {contactEmail}.
                </p>
              </motion.div>
            </section>

            <section id="retention" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.24 }}>
                <h2>Data Retention</h2>
                <p>
                  We retain personal information as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements.
                </p>
              </motion.div>
            </section>

            <section id="international" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.27 }}>
                <h2>International Transfers</h2>
                <p>
                  If we transfer data internationally, we will protect it through appropriate safeguards (standard contractual clauses, etc.). Contact us for specifics.
                </p>
              </motion.div>
            </section>

            <section id="children" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <h2>Children's Privacy</h2>
                <p>
                  Our services are not directed to children under 13. We do not knowingly collect personal information from children. If you believe we collected data from a child, contact us.
                </p>
              </motion.div>
            </section>

            <section id="changes" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.33 }}>
                <h2>Changes to this Policy</h2>
                <p>
                  We may update this policy. We will post the updated policy with a new "Last updated" date. Significant changes may be communicated by other means.
                </p>
              </motion.div>
            </section>

            <section id="contact" className="mb-8">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.36 }}>
                <h2>Contact Us</h2>
                <p>
                  For questions or to exercise your privacy rights, contact us at <a href={`mailto:${contactEmail}`} className="underline">{contactEmail}</a>.
                </p>
              </motion.div>
            </section>

            <footer className="mt-6 mb-16 text-sm text-muted-foreground">
              <p>Note: This privacy policy is a template provided for convenience and does not constitute legal advice. Consult a qualified attorney to ensure compliance with laws (e.g., GDPR, CCPA) that apply to your business.</p>
            </footer>
          </ScrollArea>
        </article>
      </div>

      {/* Cookie consent banner */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: acceptedCookies ? 0 : 1 }} transition={{ duration: 0.35 }} className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(95%,900px)]">
        {!acceptedCookies ? (
          <div className="rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-2xl border">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">We use cookies to improve your experience</p>
                <p className="text-sm text-muted-foreground">Manage your preferences or accept cookies to continue.</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => window.location.hash = "#cookies"}>Manage</Button>
                <Button onClick={() => setAcceptedCookies(true)}>Accept</Button>
              </div>
            </div>
          </div>
        ) : (
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="rounded-2xl bg-emerald-50 p-3 border">
            <p className="text-sm">Cookies accepted. You can change this later in your browser settings.</p>
          </motion.div>
        )}
      </motion.div>
    </motion.main>
  );
}
