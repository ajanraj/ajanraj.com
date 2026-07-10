export type GearItem = {
  name: string;
  note: string;
  image: string;
  href: string;
  linkLabel: string;
  affiliate?: boolean;
  compactTitle?: boolean;
  rotation: number;
  scale?: number;
};

export type GearSection = {
  number: string;
  title: string;
  items: readonly GearItem[];
};

export const GEAR_SECTIONS: readonly GearSection[] = [
  {
    number: "01",
    title: "Remember",
    items: [
      {
        name: "iPhone Air",
        note: "The camera that is always there.",
        image: "/gear/iphone-air.png",
        href: "https://www.apple.com/uk/shop/buy-iphone/iphone-air",
        linkLabel: "Apple",
        rotation: -7,
        scale: 1.12,
      },
      {
        name: "Fujifilm X100VI",
        note: "When I want to slow down and notice more.",
        image: "/gear/fujifilm-x100vi.png",
        href: "https://www.fujifilm-x.com/en-gb/products/cameras/x100vi/",
        linkLabel: "Fujifilm",
        rotation: 6,
      },
      {
        name: "SanDisk Extreme PRO 256GB",
        note: "Small enough to disappear. Fast enough not to get in the way.",
        image: "/gear/sandisk-extreme-pro-256gb.png",
        href: "https://www.sandisk.com/products/memory-cards/microsd-cards/sandisk-extreme-pro-uhs-i-microsd?sku=SDSQXCD-256G-GN6MA",
        linkLabel: "SanDisk",
        rotation: -5,
      },
    ],
  },
  {
    number: "02",
    title: "Make",
    items: [
      {
        name: "NuPhy Air75 V3",
        note: "Low profile. Long sessions.",
        image: "/gear/nuphy-air75-v3.png",
        href: "https://nuphy.com/products/nuphy-air75-v3",
        linkLabel: "NuPhy",
        rotation: -4,
        scale: 1.12,
      },
      {
        name: "Logitech MX Master 4",
        note: "The mouse I reach for when the work gets detailed.",
        image: "/gear/logitech-mx-master-4.png",
        href: "https://www.logitech.com/en-us/shop/p/mx-master-4.910-007585",
        linkLabel: "Logitech",
        rotation: 7,
      },
      {
        name: "MSI Modern MD272XPW",
        note: "A calm, practical canvas for everyday work.",
        image: "/gear/msi-modern-md272xpw.png",
        href: "https://www.msi.com/Business-Productivity-Monitor/Modern-MD272XPW",
        linkLabel: "MSI",
        rotation: 2,
        scale: 1.12,
      },
      {
        name: "SanDisk Dual Drive Luxe 128GB",
        note: "A tiny bridge between USB-C and everything else.",
        image: "/gear/sandisk-dual-drive-luxe-128gb.png",
        href: "https://amzn.eu/d/0appc7se",
        linkLabel: "Amazon",
        affiliate: true,
        compactTitle: true,
        rotation: -7,
        scale: 1.1,
      },
    ],
  },
  {
    number: "03",
    title: "Move",
    items: [
      {
        name: "WHOOP 5.0 Peak",
        note: "A quiet read on recovery, strain, and sleep.",
        image: "/gear/whoop-5.png",
        href: "https://www.whoop.com/gb/en/peak/",
        linkLabel: "WHOOP",
        rotation: -8,
      },
      {
        name: "Polar H10",
        note: "When accuracy matters more than convenience.",
        image: "/gear/polar-h10.png",
        href: "https://www.polar.com/uk-en/sensors/h10",
        linkLabel: "Polar",
        rotation: 5,
        scale: 1.2,
      },
    ],
  },
  {
    number: "04",
    title: "Stay powered",
    items: [
      {
        name: "UGREEN retractable cable",
        note: "One cable, less untangling.",
        image: "/gear/ugreen-retractable-cable.png",
        href: "https://amzn.eu/d/0ajcn7EO",
        linkLabel: "Amazon",
        affiliate: true,
        rotation: -6,
      },
      {
        name: "Belkin BoostCharge 3-in-1",
        note: "The charger that keeps the nightstand simple.",
        image: "/gear/belkin-boostcharge-3-in-1.png",
        href: "https://amzn.eu/d/06q1mdMn",
        linkLabel: "Amazon",
        affiliate: true,
        compactTitle: true,
        rotation: 6,
        scale: 1.08,
      },
      {
        name: "INIU 45W power bank",
        note: "Enough power to stop thinking about battery.",
        image: "/gear/iniu-45w-power-bank.png",
        href: "https://www.amazon.co.uk/dp/B0DCZ56QNL",
        linkLabel: "Amazon",
        rotation: -3,
        scale: 1.12,
      },
    ],
  },
  {
    number: "05",
    title: "Switch off",
    items: [
      {
        name: "PlayStation 5 Digital Edition",
        note: "Where projects stop and side quests begin.",
        image: "/gear/ps5-digital-edition.png",
        href: "https://www.playstation.com/en-gb/ps5/buy-now.html/",
        linkLabel: "PlayStation",
        compactTitle: true,
        rotation: 5,
        scale: 1.2,
      },
    ],
  },
];
