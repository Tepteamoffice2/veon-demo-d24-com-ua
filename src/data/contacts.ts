// Real channels of Delta Parts only (veon/client.json: company.contacts, socials with status "confirmed").
// The order of phones follows the client's /uk/contacts page; which one is primary is a client decision (R-007).

export interface Phone { display: string; href: string; raw: string }

export const phones: Phone[] = [
  { display: "+38 (098) 595-59-95", href: "tel:+380985955995", raw: "+380985955995" },
  { display: "+38 (096) 888-69-49", href: "tel:+380968886949", raw: "+380968886949" },
];

export const viber = { href: "https://viber.me/380968886949", number: "+38 (096) 888-69-49" };

export const email = { display: "info@d24.com.ua", href: "mailto:info@d24.com.ua" };

export const address = {
  city: "м. Київ",
  street: "вул. Колекторна, 3-А",
  entry: "заїзд з Високовольтного провулка",
};

export const mapHref =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("м. Київ, вул. Колекторна, 3-А");

export const hours = [
  { days: "Пн–Пт", time: "9:00–18:00" },
  { days: "Сб", time: "10:00–14:00" },
  { days: "Нд", time: "вихідний" },
];

export const socials = [
  { name: "Facebook", href: "https://www.facebook.com/DeltaPartsMarket" },
  { name: "Instagram", href: "https://www.instagram.com/d24.com.ua/" },
  { name: "TikTok", href: "https://www.tiktok.com/@d24_com_ua" },
  { name: "YouTube", href: "https://www.youtube.com/@D24_kyiv" },
];

export const anchors = [
  { href: "#vin", label: "Підбір за VIN" },
  { href: "#catalog", label: "Асортимент" },
  { href: "#delivery", label: "Доставка й оплата" },
  { href: "#wholesale", label: "Оптовим" },
  { href: "#contacts", label: "Контакти" },
];

export const SOON = "Розділ у розробці";
