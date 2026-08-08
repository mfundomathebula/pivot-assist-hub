export const site = {
  name: "PearliiBeauty",
  tagline: "Professional Makeup Artist | Vosloorus",
  phone: "065 230 5824",
  phoneHref: "tel:+27652305824",
  location: "Vosloorus, Gauteng",
  hours: "Monday – Sunday | 09:00 – 16:00",
  timezone: "Africa/Johannesburg",
} as const;

export const navLinks = [
  { label: "Home", to: "/" as const, hash: undefined },
  { label: "Services", to: "/" as const, hash: "services" },
  { label: "About", to: "/" as const, hash: "about" },
  { label: "Book", to: "/book" as const, hash: undefined },
];
