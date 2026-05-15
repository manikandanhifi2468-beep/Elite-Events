import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/916381534560"
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring" }}
      className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gold text-primary-foreground shadow-gold hover:scale-110 transition"
      aria-label="WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-30" />
      <MessageCircle className="relative h-6 w-6" />
    </motion.a>
  );
}
