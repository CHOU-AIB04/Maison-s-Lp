export const CDN = "https://res.cloudinary.com/drn1zdkwa/image/upload";
export const img = (path: string, w = 800) => `${CDN}/f_auto,q_auto,w_${w}/${path}`;

export const WHATSAPP = "212722474350";

// Frais de livraison par ville (COD Maroc)
export type City = { name: string; fee: number };
export const CITIES: City[] = [
  { name: "Casablanca", fee: 20 },
  { name: "Mohammedia", fee: 20 },
  { name: "Rabat", fee: 20 },
  { name: "Salé", fee: 20 },
  { name: "Témara", fee: 20 },
  { name: "Kénitra", fee: 20 },
  { name: "Marrakech", fee: 20 },
  { name: "Tanger", fee: 20 },
  { name: "Tétouan", fee: 20 },
  { name: "Agadir", fee: 20 },
  { name: "Fès", fee: 20 },
  { name: "Meknès", fee: 20 },
  { name: "El Jadida", fee: 30 },
  { name: "Oujda", fee: 30 },
  { name: "Nador", fee: 30 },
  { name: "Beni Mellal", fee: 30 },
  { name: "Safi", fee: 30 },
  { name: "Khouribga", fee: 30 },
  { name: "Autre ville", fee: 30 },
];

export const EXTRA_ITEM_DISCOUNT = 30; // -30 DH sur CHAQUE article à partir du 2e (même modèle) = 21% de 139 / 20% de 149
export const UPSELL_PCT = 50; // -50% sur l'AUTRE modèle pris en 2e article (upsell)

export type ColorOpt = { key: string; ar: string; fr: string; img: string };
export type Upsell = { id: string; slug: string; emoji: string; nameAr: string; nameFr: string; price: number; img: string };
export type Model = {
  id: string;
  slug: string;
  emoji: string;
  price: number;
  nameAr: string;
  nameFr: string;
  subAr: string;
  subFr: string;
  hero: string;
  qtyPct: number; // % de remise sur chaque article dès le 2e (Swan 21, Tulip 20)
  colors: ColorOpt[];
  gallery: string[];
  upsell: Upsell;
};

export const SWAN: Model = {
  id: "swan",
  slug: "swan",
  emoji: "🦢",
  price: 139,
  nameAr: "طقم Swan · عقد + سوار",
  nameFr: "Ensemble Swan · Collier + Bracelet",
  subAr: "تصميم Swan راقٍ · ذهب مقاوم · أناقة تلفت الأنظار",
  subFr: "Design Swan raffiné · Plaqué or résistant · Une élégance qui attire les regards",
  hero: "v1782485788/prod12_black_c_nqjzw6.jpg",
  qtyPct: 21,
  colors: [
    { key: "Noir", ar: "أسود", fr: "Noir", img: "v1782485788/prod12_black_c_nqjzw6.jpg" },
    { key: "Blanc", ar: "أبيض", fr: "Blanc", img: "v1782485789/prod12_white_c_cg7zrs.jpg" },
  ],
  gallery: [
    "v1782485788/prod12_black_c_nqjzw6.jpg",
    "v1782485789/prod12_white_c_cg7zrs.jpg",
    "v1782146355/product_10_gebr70.png",
    "v1782146353/product_11_hr9u2c.png",
    "v1782146354/product_12_lskeyt.png",
  ],
  upsell: {
    id: "tulip", slug: "tulip", emoji: "🌷",
    nameAr: "طقم Tulip", nameFr: "Ensemble Tulip", price: 149,
    img: "v1783970112/768b1aec724deadb6a4cc64a180ccfc7_1_1783969735_4237_xn6aze.png",
  },
};

export const TULIP: Model = {
  id: "tulip",
  slug: "tulip",
  emoji: "🌷",
  price: 149,
  nameAr: "طقم Tulip · عقد + سوار",
  nameFr: "Ensemble Tulip · Collier + Bracelet",
  subAr: "تصميم Tulip زهري · لمسة أنوثة راقية · ذهب مقاوم",
  subFr: "Design floral Tulip · Une touche de féminité raffinée · Plaqué or résistant",
  hero: "v1783970112/768b1aec724deadb6a4cc64a180ccfc7_1_1783969735_4237_xn6aze.png",
  qtyPct: 20,
  colors: [
    { key: "Bicolore", ar: "ثنائي اللون", fr: "Bicolore", img: "v1783970112/768b1aec724deadb6a4cc64a180ccfc7_1_1783969735_4237_xn6aze.png" },
    { key: "Prestige", ar: "برستيج", fr: "Prestige", img: "v1782485786/prod10_white_c_ffubmd.jpg" },
    { key: "Doré", ar: "ذهبي", fr: "Doré", img: "v1782485761/prod7_white_c_qfwvfm.jpg" },
  ],
  gallery: [
    "v1783970112/768b1aec724deadb6a4cc64a180ccfc7_1_1783969735_4237_xn6aze.png",
    "v1783970110/b03f100966953754e42c6a0362c26fc8_1_1783969577_7111_qeazz3.png",
    "v1783970701/4f65dcf49a67ed61428e243c172e7b67_1_1783970597_2135_h0dl2l.png",
    "v1783970333/923c021705d00157b6d5caca46c40f77_1_1783969874_6864_slrd7d.png",
    "v1783970532/1d4a9ad34ffcf503e5f00d7d382d5539_1783970466945_fjla1y.png",
    "v1783970789/7c8c9bed4a89e631817eb9b30b295f4c_1783970728862_ge8tku.png",
  ],
  upsell: {
    id: "swan", slug: "swan", emoji: "🦢",
    nameAr: "طقم Swan", nameFr: "Ensemble Swan", price: 139,
    img: "v1782485788/prod12_black_c_nqjzw6.jpg",
  },
};

export const MODELS: Record<string, Model> = { swan: SWAN, tulip: TULIP };
