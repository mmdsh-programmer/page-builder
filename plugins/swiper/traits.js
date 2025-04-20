export const traits = [
  // options -----------------------------------------------------
  {
    type: "checkbox",
    name: "navigation",
    label: "navigation",
    value: true,
    changeProp: 1,
    category: "options",
  },
  // pagination -----------------------------------------------------
  {
    type: "checkbox",
    name: "pagination",
    label: "enable pagination",
    value: true,
    changeProp: 1,
    category: "pagination",
  },
  {
    type: "checkbox",
    name: "dynamicBullets",
    label: "Dynamic Bullets",
    value: true,
    changeProp: 1,
    category: "pagination",
  },
  {
    type: "select",
    name: "progressType",
    label: "Progress Type",
    changeProp: 1,
    options: [
      { value: "bullets", name: "Bullets" },
      { value: "fraction", name: "Fraction" },
      { value: "progressbar", name: "Progressbar" },
    ],
    category: "pagination",
  },
  {
    type: "color",
    name: "paginationColor",
    label: "Pagination Color",
    value: "#096dd9",
    changeProp: 1,
    category: "pagination",
  },
  // slides -----------------------------------------------------
  {
    type: "number",
    name: "slidesCount",
    label: "Slides Count",
    min: 2, // Minimum number value
    max: 20, // Maximum number value
    value: 1,
    changeProp: 1,
    category: "slides",
  },
];
