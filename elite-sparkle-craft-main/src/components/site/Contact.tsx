import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Loader2, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SectionHeading } from "./Reveal";
import { toast } from "sonner";

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  eventDate: string;
  message: string;
}

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockedPlan, setLockedPlan] = useState<any>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  useEffect(() => {
    // Check for locked plan from Planner
    const checkLockedPlan = () => {
      const plan = localStorage.getItem("lockedPlan");
      if (plan) {
        setLockedPlan(JSON.parse(plan));
      }
    };

    checkLockedPlan();
    window.addEventListener("storage", checkLockedPlan);
    return () => window.removeEventListener("storage", checkLockedPlan);
  }, []);

  const generateMessage = (data: ContactFormData) => {
    let msg = `*New Inquiry*\n\n*Name:* ${data.fullName}\n*Email:* ${data.email}\n*Phone:* ${data.phone}\n*Event Date:* ${data.eventDate}\n*Message:* ${data.message}`;
    if (lockedPlan) {
      msg += `\n\n*AI Planner Details*\n*Package:* ${lockedPlan.pkg}\n*Estimated Cost:* ₹${lockedPlan.cost.toLocaleString()}\n*Guests:* ${lockedPlan.guests}\n*Event Type:* ${lockedPlan.eventType}\n*Food:* ${lockedPlan.foodPreference}`;
    }
    return msg;
  };

  const onWhatsApp = async (data: ContactFormData) => {
    const rawText = generateMessage(data);
    const text = encodeURIComponent(rawText);
    const url = `https://wa.me/916381534560?text=${text}`;
    
    // 1. Copy to clipboard immediately
    try {
      await navigator.clipboard.writeText(rawText);
    } catch (err) {
      console.error("Clipboard error:", err);
    }

    // 2. Open WhatsApp immediately (satisfies popup blockers)
    window.open(url, '_blank');
    toast.success("Details copied! Opening WhatsApp...");

    // 3. Save to database in the background
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "inquiries"), {
        ...data,
        planDetails: lockedPlan,
        status: "new",
        createdAt: serverTimestamp(),
      });
      reset();
      setLockedPlan(null);
      localStorage.removeItem("lockedPlan");
    } catch (error) {
      console.error("Firebase error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onMail = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "inquiries"), {
        ...data,
        planDetails: lockedPlan,
        status: "new",
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Firebase error:", error);
    } finally {
      setIsSubmitting(false);
      let body = `Name: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nEvent Date: ${data.eventDate}\nMessage: ${data.message}`;
      if (lockedPlan) {
        body += `\n\nAI Planner Details\nPackage: ${lockedPlan.pkg}\nEstimated Cost: ₹${lockedPlan.cost.toLocaleString()}\nGuests: ${lockedPlan.guests}\nEvent Type: ${lockedPlan.eventType}\nFood: ${lockedPlan.foodPreference}`;
      }
      window.location.href = `mailto:manikandanhifi2468@gmail.com?subject=New Inquiry from ${data.fullName}&body=${encodeURIComponent(body)}`;
      toast.success("Opening Email client...");
      reset();
      setLockedPlan(null);
      localStorage.removeItem("lockedPlan");
    }
  };

  const onValidationError = () => {
    toast.error("Please fill in all required fields.");
  };

  return (
    <section id="contact" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Get in Touch"
          title="Let's plan something extraordinary"
          subtitle="Tell us about your event. We'll respond within 24 hours."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            {[
              { icon: Phone, label: "Phone", val: "+91 63815 34560" },
              { icon: Mail, label: "Email", val: "manikandanhifi2468@gmail.com" },
              { icon: MapPin, label: "Studio", val: "12 Cathedral Rd, Chennai 600086" },
            ].map((c) => (
              <div key={c.label} className="glass rounded-2xl p-5 flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl gold-border">
                  <c.icon className="h-5 w-5 text-gold" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{c.label}</p>
                  <p className="text-sm">{c.val}</p>
                </div>
              </div>
            ))}

            <div className="overflow-hidden rounded-2xl gold-border h-56 relative">
              <iframe
                title="Map"
                src="https://maps.google.com/maps?q=Chennai&t=&z=12&ie=UTF8&iwloc=&output=embed"
                className="h-full w-full grayscale opacity-80"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={(e) => e.preventDefault()}
            className="lg:col-span-3 glass rounded-3xl p-8 shadow-elev"
          >
            {lockedPlan && (
              <div className="mb-6 rounded-xl bg-gold/10 p-4 border border-gold/20">
                <p className="text-xs uppercase tracking-widest text-gold font-semibold">Locked Plan Details</p>
                <p className="mt-1 text-sm">
                  {lockedPlan.pkg} Package • {lockedPlan.cost.toLocaleString()} • {lockedPlan.guests} Guests
                </p>
                <button 
                  type="button"
                  onClick={() => {
                    setLockedPlan(null);
                    localStorage.removeItem("lockedPlan");
                  }}
                  className="mt-2 text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Clear plan
                </button>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full Name" placeholder="Your name" {...register("fullName", { required: true })} />
              <Field label="Email" type="email" placeholder="you@email.com" {...register("email", { required: true })} />
              <Field label="Phone" placeholder="+91" {...register("phone", { required: true })} />
              <Field label="Event Date" type="date" {...register("eventDate", { required: true })} />
            </div>
            <div className="mt-5">
              <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Message</label>
              <textarea
                rows={5}
                placeholder="Tell us about your event..."
                {...register("message", { required: true })}
                className="mt-2 w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-sm outline-none focus:border-[var(--gold)] transition"
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleSubmit(onWhatsApp, onValidationError)}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                Send via WhatsApp
              </button>
              <button
                type="button"
                onClick={handleSubmit(onMail, onValidationError)}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold transition-transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Send via Email
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

const Field = ({ label, ...rest }: any) => {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{label}</label>
      <input
        {...rest}
        className="mt-2 w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-sm outline-none focus:border-[var(--gold)] transition"
      />
    </div>
  );
};
