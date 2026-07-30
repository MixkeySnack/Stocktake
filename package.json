// Single source of truth for which locations (sheet tabs) and items exist.
// Sheet tab names must match LOCATIONS exactly.

const LOCATIONS = ['QLD', 'WA', 'SA'];

const SECTIONS = [
  {
    key: 'coffee',
    label: 'Coffee Section',
    items: [
      { id: 'B1', name: 'Strong Roasted Coffee', unit: 'Bag', par: 5 },
      { id: 'B2', name: 'Medium Roasted Coffee', unit: 'Bag', par: 5 },
    ],
  },
  {
    key: 'packaging',
    label: 'Packaging Section',
    items: [
      { id: 'C1', name: 'Paper Cup', unit: 'Box', par: 10 },
      { id: 'C2', name: 'Small Cup Brown', unit: 'Box', par: 10 },
      { id: 'C3', name: 'Plastic Cup Brown', unit: 'Box', par: 10 },
      { id: 'L1', name: 'New Lid', unit: 'Box', par: 10 },
      { id: 'T1', name: 'Straw paper', unit: 'Box', par: 10 },
    ],
  },
  {
    key: 'powder',
    label: 'Powder Section',
    items: [
      { id: 'P1', name: 'Oreo Crush Cookie Pieces', unit: 'Box', par: 5 },
      { id: 'P2', name: 'Milk', unit: 'Box', par: 5 },
      { id: 'P3', name: 'Bischoff Biscuits', unit: 'Box', par: 5 },
      { id: 'P4', name: 'Coco Powder', unit: 'Box', par: 5 },
      { id: 'P5', name: 'Lime Powder', unit: 'Box', par: 5 },
      { id: 'P6', name: 'Oat Milk', unit: 'Box', par: 5 },
      { id: 'P7', name: 'Sugar', unit: 'Box', par: 5 },
      { id: 'P8', name: 'Whey', unit: 'Box', par: 5 },
      { id: 'P9', name: 'Jasmine Tea', unit: 'Box', par: 5 },
      { id: 'P10', name: 'Singha Thai Tea', unit: 'Box', par: 5 },
      { id: 'P11', name: 'Matcha', unit: 'Box', par: 5 },
    ],
  },
  {
    key: 'syrup',
    label: 'Syrup Section',
    items: [
      { id: 'S1', name: 'Caramel', unit: 'Box', par: 5 },
      { id: 'S2', name: 'Mint', unit: 'Box', par: 5 },
      { id: 'S3', name: 'Vanilla', unit: 'Box', par: 5 },
      { id: 'S4', name: 'Coconut', unit: 'Box', par: 5 },
      { id: 'S5', name: 'Lychee', unit: 'Box', par: 5 },
      { id: 'S6', name: 'Strawberry', unit: 'Box', par: 5 },
      { id: 'S7', name: 'Peach', unit: 'Box', par: 5 },
      { id: 'S8', name: 'Yuzu', unit: 'Box', par: 5 },
      { id: 'S9', name: 'Apple', unit: 'Box', par: 5 },
      { id: 'SM1', name: 'Pepsi Black', unit: 'Box', par: 5 },
      { id: 'SM2', name: 'Energy drink', unit: 'Box', par: 5 },
    ],
  },
];

function flatItems() {
  const out = [];
  SECTIONS.forEach(sec => {
    sec.items.forEach(item => out.push({ ...item, section: sec.key, sectionLabel: sec.label }));
  });
  return out;
}

module.exports = { LOCATIONS, SECTIONS, flatItems };
