export const initialClients = [
  { id: 1, name: "Nexaflow Inc.", email: "hello@nexaflow.com", project: "Brand Redesign", status: "active", budget: 4800, paid: 3200, progress: 65, avatar: "NX", color: "#4F8EF7", due: "Mar 28, 2026", files: 4, messages: 3 },
  { id: 2, name: "Lumira Studio", email: "contact@lumira.io", project: "Website Dev", status: "review", budget: 7500, paid: 7500, progress: 95, avatar: "LS", color: "#A78BFA", due: "Mar 12, 2026", files: 7, messages: 1 },
  { id: 3, name: "Orbit Media", email: "team@orbitmedia.co", project: "Social Campaign", status: "pending", budget: 2200, paid: 0, progress: 10, avatar: "OM", color: "#34D399", due: "Apr 15, 2026", files: 1, messages: 0 },
  { id: 4, name: "Vantage Capital", email: "ops@vantage.com", project: "Pitch Deck", status: "completed", budget: 1800, paid: 1800, progress: 100, avatar: "VC", color: "#FBBF24", due: "Feb 20, 2026", files: 3, messages: 0 },
];

export const initialMessages = [
  { id: 1, clientId: 1, sender: "client", text: "Hey! Can we update the logo to be more minimal?", time: "10:32 AM", read: true },
  { id: 2, clientId: 1, sender: "you", text: "Absolutely, I'll send 3 variations by EOD.", time: "10:45 AM", read: true },
  { id: 3, clientId: 1, sender: "client", text: "Perfect, also the color palette needs to match our website.", time: "11:02 AM", read: false },
  { id: 4, clientId: 2, sender: "client", text: "The homepage looks great! Just need mobile fixes.", time: "Yesterday", read: true },
  { id: 5, clientId: 2, sender: "you", text: "On it — should be done by tomorrow morning.", time: "Yesterday", read: true },
];

export const initialInvoices = [
  { id: "INV-001", clientId: 1, amount: 1600, status: "paid", date: "Mar 1, 2026", due: "Mar 15, 2026" },
  { id: "INV-002", clientId: 1, amount: 1600, status: "unpaid", date: "Mar 15, 2026", due: "Mar 29, 2026" },
  { id: "INV-003", clientId: 2, amount: 7500, status: "paid", date: "Feb 10, 2026", due: "Feb 24, 2026" },
  { id: "INV-004", clientId: 3, amount: 2200, status: "draft", date: "Mar 7, 2026", due: "Mar 21, 2026" },
  { id: "INV-005", clientId: 4, amount: 1800, status: "paid", date: "Feb 1, 2026", due: "Feb 15, 2026" },
];

export const statusConfig = {
  active: { label: "Active", color: "#34D399", bg: "#34D39920" },
  review: { label: "In Review", color: "#FBBF24", bg: "#FBBF2420" },
  pending: { label: "Pending", color: "#A78BFA", bg: "#A78BFA20" },
  completed: { label: "Completed", color: "#64748B", bg: "#33415520" },
};
