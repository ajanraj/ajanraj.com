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
        href: "https://www.amazon.co.uk/dp/B0FQFZLX6D?th=1&linkCode=ll2&tag=ajanrajuk-21&linkId=dd0d3dae532bc55e28afb3b7dbd5bc43&ref_=as_li_ss_tl",
        linkLabel: "Amazon",
        affiliate: true,
        rotation: -7,
        scale: 1.12,
      },
      {
        name: "Fujifilm X100VI",
        note: "When I want to slow down and notice more.",
        image: "/gear/fujifilm-x100vi.png",
        href: "https://www.amazon.co.uk/dp/B0CV523K92?th=1&linkCode=ll2&tag=ajanrajuk-21&linkId=9540b8c7e9efe655c864be4749558514&ref_=as_li_ss_tl",
        linkLabel: "Amazon",
        affiliate: true,
        rotation: 6,
      },
      {
        name: "SanDisk Extreme PRO 256GB",
        note: "Small enough to disappear. Fast enough not to get in the way.",
        image: "/gear/sandisk-extreme-pro-256gb.png",
        href: "https://www.amazon.co.uk/dp/B09X7DMBVF?th=1&linkCode=ll2&tag=ajanrajuk-21&linkId=7e750a9ef1fd6f9789d72da31d1dae4c&ref_=as_li_ss_tl",
        linkLabel: "Amazon",
        affiliate: true,
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
        href: "https://www.amazon.co.uk/dp/B0FP2LD79F?th=1&linkCode=ll2&tag=ajanrajuk-21&linkId=58965621f6d1b78bdfdf263411bd5a46&ref_=as_li_ss_tl",
        linkLabel: "Amazon",
        affiliate: true,
        rotation: -4,
        scale: 1.12,
      },
      {
        name: "Logitech MX Master 4",
        note: "The mouse I reach for when the work gets detailed.",
        image: "/gear/logitech-mx-master-4.png",
        href: "https://www.amazon.co.uk/dp/B0FHHSZ8WM?th=1&linkCode=ll2&tag=ajanrajuk-21&linkId=ac3bf4701026504106f5a4206a8643f4&ref_=as_li_ss_tl",
        linkLabel: "Amazon",
        affiliate: true,
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
        href: "https://www.amazon.co.uk/SanDisk-Reversible-connectors-Smartphone-computers/dp/B0842P5GBQ?crid=6QA7AOLXZQMX&dib=eyJ2IjoiMSJ9.4T8vtMDlER2G8jPylumRK1KqIj5vHWtJJlJ1Cs9i6xCQZJJwAIgOROu2pWqd3FJnK6b4mcwIh5pnV3jaD-24l3kxJjWzUawbR6xiJMfA3MWLBaF2hjY8gY378aGLzdqleD8Hrvszmkhe6TOaSzqqn3i-pWPkKcPkWthilV1bjcJ4oTPgdC-Tc9wW-c10sXWqcuZSnnHOYYwXQX1ih2dXOtlAKW2aR5ftocKHcqJfmzw.FT-1pejMjvwnYoGZ_5Q_syskwKNSveEySULhaXN2amE&dib_tag=se&keywords=sandisk%2Busb%2Bstick%2Bluxe&qid=1783718039&sprefix=sandisk%2Busb%2Bstick%2Bluxe%2Caps%2C119&sr=8-1&th=1&linkCode=ll2&tag=ajanrajuk-21&linkId=d24a401ae54c40643096d632fb86e18c&ref_=as_li_ss_tl",
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
        href: "https://www.amazon.co.uk/dp/B0DY2SWV16?th=1&linkCode=ll2&tag=ajanrajuk-21&linkId=9e4a6a436a62907d340e01388ab6fe80&ref_=as_li_ss_tl",
        linkLabel: "Amazon",
        affiliate: true,
        rotation: -8,
      },
      {
        name: "Polar H10",
        note: "When accuracy matters more than convenience.",
        image: "/gear/polar-h10.png",
        href: "https://www.amazon.co.uk/dp/B07PM54P4N?&linkCode=ll2&tag=ajanrajuk-21&linkId=2bdaef819c90b1bde02321d0d6c1a9f8&ref_=as_li_ss_tl",
        linkLabel: "Amazon",
        affiliate: true,
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
        href: "https://www.amazon.co.uk/dp/B0DXDT9SKW?th=1&linkCode=ll2&tag=ajanrajuk-21&linkId=54123676ff6d701d4db5bf784f2fffeb&ref_=as_li_ss_tl",
        linkLabel: "Amazon",
        affiliate: true,
        rotation: -6,
      },
      {
        name: "Belkin BoostCharge 3-in-1",
        note: "The charger that keeps the nightstand simple.",
        image: "/gear/belkin-boostcharge-3-in-1.png",
        href: "https://www.amazon.co.uk/dp/B0F8NSVFSN?th=1&linkCode=ll2&tag=ajanrajuk-21&linkId=9a95190f137ce11f90cbeb86c151e0b5&ref_=as_li_ss_tl",
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
        href: "https://www.amazon.co.uk/dp/B0DCZ56QNL?&linkCode=ll2&tag=ajanrajuk-21&linkId=16c906e39b5cd93afa20b537e4a0c819&ref_=as_li_ss_tl",
        linkLabel: "Amazon",
        affiliate: true,
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
        href: "https://www.amazon.co.uk/dp/B0FM3SBZK3?th=1&linkCode=ll2&tag=ajanrajuk-21&linkId=5d0aa7632beec2071d5effe2fa6af406&ref_=as_li_ss_tl",
        linkLabel: "Amazon",
        affiliate: true,
        compactTitle: true,
        rotation: 5,
        scale: 1.2,
      },
    ],
  },
];
