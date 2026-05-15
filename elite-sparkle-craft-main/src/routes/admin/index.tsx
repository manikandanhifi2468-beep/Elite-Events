import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Trash2, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  Sparkles
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  eventDate: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: any;
  planDetails?: {
    cost: number;
    pkg: string;
    eventType: string;
    guests: number;
    budget: number;
    foodPreference: string;
  };
}

function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate({ to: "/admin/login" });
      }
    });

    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry));
      setInquiries(docs);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const updateStatus = async (id: string, status: Inquiry['status']) => {
    try {
      await updateDoc(doc(db, "inquiries", id), { status });
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteInquiry = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await deleteDoc(doc(db, "inquiries", id));
        toast.success("Inquiry deleted");
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
      } catch (error) {
        toast.error("Failed to delete inquiry");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Clock className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl gold-border">
              <Sparkles className="h-5 w-5 text-gold" />
            </div>
            <h1 className="font-display text-xl">Elite Admin</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* List */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-lg font-semibold px-2">Inquiries ({inquiries.length})</h2>
            <div className="space-y-3">
              {inquiries.map((inquiry) => (
                <button
                  key={inquiry.id}
                  onClick={() => setSelectedInquiry(inquiry)}
                  className={`w-full text-left glass rounded-2xl p-5 transition-all hover:scale-[1.01] ${
                    selectedInquiry?.id === inquiry.id ? "gold-border ring-1 ring-gold/20" : "border border-border/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{inquiry.fullName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{inquiry.email}</p>
                    </div>
                    <StatusBadge status={inquiry.status} />
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {inquiry.eventDate}</span>
                    {inquiry.planDetails && <span className="flex items-center gap-1 text-gold"><Sparkles className="h-3 w-3" /> AI Plan</span>}
                  </div>
                </button>
              ))}
              {inquiries.length === 0 && (
                <div className="py-20 text-center text-muted-foreground glass rounded-3xl">
                  No inquiries found yet.
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {selectedInquiry ? (
                <motion.div
                  key={selectedInquiry.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass rounded-3xl p-8 sticky top-28"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-display text-3xl">{selectedInquiry.fullName}</h2>
                      <p className="text-muted-foreground mt-1">Received on {new Date(selectedInquiry.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => deleteInquiry(selectedInquiry.id)}
                        className="p-2 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <InfoCard icon={Mail} label="Email" value={selectedInquiry.email} />
                    <InfoCard icon={Phone} label="Phone" value={selectedInquiry.phone} />
                    <InfoCard icon={Calendar} label="Event Date" value={selectedInquiry.eventDate} />
                    <InfoCard icon={Clock} label="Status" value={selectedInquiry.status.toUpperCase()} />
                  </div>

                  {selectedInquiry.planDetails && (
                    <div className="mt-8 rounded-2xl gold-border bg-gold/5 p-6">
                      <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold font-bold">
                        <Sparkles className="h-4 w-4" /> AI Planner Details
                      </h3>
                      <div className="mt-4 grid gap-6 sm:grid-cols-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Type & Guests</p>
                          <p className="mt-1 font-medium">{selectedInquiry.planDetails.eventType} • {selectedInquiry.planDetails.guests} Guests</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Estimated Cost</p>
                          <p className="mt-1 font-display text-xl text-gold">₹{selectedInquiry.planDetails.cost.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Suggested Package</p>
                          <p className="mt-1 font-medium">{selectedInquiry.planDetails.pkg}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Food Preference</p>
                          <p className="mt-1 font-medium">{selectedInquiry.planDetails.foodPreference}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8">
                    <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">
                      <MessageSquare className="h-4 w-4" /> Message
                    </h3>
                    <div className="mt-3 rounded-2xl bg-background/40 p-5 text-sm leading-relaxed border border-border/50">
                      {selectedInquiry.message}
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-border">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      <StatusButton 
                        active={selectedInquiry.status === 'new'} 
                        label="New" 
                        onClick={() => updateStatus(selectedInquiry.id, 'new')} 
                      />
                      <StatusButton 
                        active={selectedInquiry.status === 'in-progress'} 
                        label="In Progress" 
                        onClick={() => updateStatus(selectedInquiry.id, 'in-progress')} 
                      />
                      <StatusButton 
                        active={selectedInquiry.status === 'resolved'} 
                        label="Resolved" 
                        onClick={() => updateStatus(selectedInquiry.id, 'resolved')} 
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="glass rounded-3xl h-[600px] flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                  <div className="h-16 w-16 rounded-full gold-border flex items-center justify-center mb-6">
                    <ChevronRight className="h-8 w-8 text-gold/40" />
                  </div>
                  <h3 className="text-xl font-display text-foreground">Select an inquiry</h3>
                  <p className="mt-2 text-sm max-w-xs">Click on an inquiry from the list to view full details and manage the lead.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: Inquiry['status'] }) {
  const colors = {
    new: "bg-gold/10 text-gold border-gold/20",
    'in-progress': "bg-blue-500/10 text-blue-500 border-blue-500/20",
    resolved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${colors[status]}`}>
      {status}
    </span>
  );
}

function InfoCard({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-background/40 border border-border/50">
      <div className="h-8 w-8 grid place-items-center rounded-lg gold-border bg-gold/5">
        <Icon className="h-4 w-4 text-gold" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function StatusButton({ active, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
        active 
          ? "bg-gold text-primary-foreground shadow-gold" 
          : "border border-border text-muted-foreground hover:border-gold hover:text-gold"
      }`}
    >
      {label}
    </button>
  );
}
