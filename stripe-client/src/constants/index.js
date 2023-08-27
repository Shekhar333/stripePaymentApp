export const plans = [
  {
    name: "Mobile",
    price: { monthly: 100, yearly: "1,000" },
    videoQuality: "Good",
    resolution: "480p",
    devices: ["Phone", "Tablet", "x", "x"],
    stripe_id: {
      monthly: "price_1NjGFVSENPyDnbtAPsseRmIT",
      yearly: "price_1NjGFVSENPyDnbtApLJcuJvU",
    },
  },
  {
    name: "Basic",
    price: { monthly: 200, yearly: "2,000" },
    videoQuality: "Good",
    resolution: "480p",
    devices: ["Phone", "Tablet", "Computer", "TV"],
    stripe_id: {
      monthly: "price_1NjQShSENPyDnbtAQSZswRLB",
      yearly: "price_1NjQShSENPyDnbtAu1LOIY3t",
    },
  },
  {
    name: "Standard",
    price: { monthly: 500, yearly: "5,000" },
    videoQuality: "Better",
    resolution: "1080p",
    devices: ["Phone", "Tablet", "Computer", "TV"],
    stripe_id: {
      monthly: "price_1NjQTtSENPyDnbtAYFgTDjIc",
      yearly: "price_1NjQTtSENPyDnbtA8z0qZvYA",
    },
  },
  {
    name: "Premium",
    price: { monthly: 700, yearly: "7,000" },
    videoQuality: "Best",
    resolution: "4K+HDR",
    devices: ["Phone", "Tablet", "Computer", "TV"],
    stripe_id: {
      monthly: "price_1NjQVASENPyDnbtAlcUDJWpl",
      yearly: "price_1NjQVASENPyDnbtAYTdrnCRt",
    },
  },
];
