/**
 * Email de notification de commande (Resend) — repris du site maison-dor.store
 * et adapté aux landing pages (bundle + variante).
 */

export type EmailItem = {
  name: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
};

export type EmailPayload = {
  orderNum: string;
  customerName: string;
  phone: string;
  address: string;
  cityName: string;
  items: EmailItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  source: string;
  utmSource?: string;
  utmContent?: string;
};

export function buildOrderEmailHtml(data: EmailPayload): string {
  const gold = "#C4973E";
  const dark = "#1A1612";
  const cream = "#F9F6F0";
  const lightGold = "#F3EAD8";

  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:14px 0; border-bottom:1px solid #EDE8DF; vertical-align:middle;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td width="64" style="vertical-align:middle; padding-right:16px;">
              <img src="${item.image}" alt="${item.name}" width="64" height="64"
                style="width:64px; height:64px; object-fit:cover; border-radius:4px; border:1px solid #EDE8DF; display:block;" />
            </td>
            <td style="vertical-align:middle;">
              <p style="margin:0 0 4px; font-family:'Georgia',serif; font-size:15px; color:${dark}; font-weight:600;">${item.name}</p>
              <p style="margin:0 0 4px; font-family:Arial,sans-serif; font-size:12px; color:#8C7B6A; letter-spacing:0.05em;">${item.variant}</p>
              <p style="margin:0; font-family:Arial,sans-serif; font-size:12px; color:#8C7B6A;">Qté : ${item.quantity}</p>
            </td>
            <td width="90" style="vertical-align:middle; text-align:right;">
              <p style="margin:0; font-family:'Georgia',serif; font-size:15px; font-weight:700; color:${gold};">${(item.price * item.quantity).toLocaleString("fr-MA")} MAD</p>
              <p style="margin:4px 0 0; font-family:Arial,sans-serif; font-size:11px; color:#AAA;">${item.price} × ${item.quantity}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Nouvelle commande — Maison d'Or</title></head>
<body style="margin:0; padding:0; background-color:#F0EBE1; font-family:Arial,sans-serif;">
  <table cellpadding="0" cellspacing="0" width="100%" style="background-color:#F0EBE1; padding:40px 20px;">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" width="600" style="max-width:600px; width:100%;">

        <tr>
          <td style="background-color:${dark}; padding:32px 40px; text-align:center; border-radius:8px 8px 0 0;">
            <img src="https://res.cloudinary.com/drn1zdkwa/image/upload/v1782152344/Design_sans_titre_w0w0r5.png"
              alt="Maison d'Or" width="160" style="width:160px; height:auto; display:block; margin:0 auto 16px;" />
            <p style="margin:0; font-family:Arial,sans-serif; font-size:11px; letter-spacing:0.3em; color:${gold}; text-transform:uppercase;">
              ✦ Landing Page — ${data.source} ✦
            </p>
          </td>
        </tr>

        <tr><td style="height:4px; background:linear-gradient(90deg, ${dark}, ${gold}, ${dark});"></td></tr>

        <tr>
          <td style="background-color:#FFFFFF; padding:32px 40px 24px; text-align:center;">
            <p style="margin:0 0 8px; font-family:Arial,sans-serif; font-size:11px; letter-spacing:0.25em; color:${gold}; text-transform:uppercase;">— Nouvelle commande —</p>
            <h1 style="margin:0 0 16px; font-family:'Georgia',serif; font-size:30px; font-weight:400; color:${dark}; line-height:1.2;">Commande reçue ✓</h1>
            <div style="display:inline-block; background-color:${lightGold}; border:1px solid #DDD0B8; border-radius:4px; padding:10px 28px; margin-bottom:16px;">
              <p style="margin:0 0 4px; font-family:Arial,sans-serif; font-size:11px; color:#8C7B6A; letter-spacing:0.2em; text-transform:uppercase;">Référence</p>
              <p style="margin:0; font-family:'Georgia',serif; font-size:20px; font-weight:700; color:${dark};">${data.orderNum}</p>
            </div>
            ${
              data.utmSource || data.utmContent
                ? `<p style="margin:0 0 14px; font-family:Arial,sans-serif; font-size:12px; color:#8C7B6A;">
                     📣 ${data.utmSource ? `Source : <strong style="color:${dark};">${data.utmSource}</strong>` : ""}
                     ${data.utmSource && data.utmContent ? " · " : ""}
                     ${data.utmContent ? `Créa : <strong style="color:${dark};">${data.utmContent}</strong>` : ""}
                   </p>`
                : ""
            }
            <table cellpadding="0" cellspacing="0" style="margin:0 auto; background:#FFF8EC; border:1px solid #E8D5A3; border-radius:6px;">
              <tr>
                <td style="padding:10px 16px; text-align:center;"><p style="margin:0; font-family:Arial,sans-serif; font-size:13px; color:#7A5C1E; font-weight:600;">👤 ${data.customerName}</p></td>
                <td style="padding:10px 16px; text-align:center; border-left:1px solid #E8D5A3;"><p style="margin:0; font-family:Arial,sans-serif; font-size:13px; color:#7A5C1E; font-weight:600;">📞 ${data.phone}</p></td>
                <td style="padding:10px 16px; text-align:center; border-left:1px solid #E8D5A3;"><p style="margin:0; font-family:Arial,sans-serif; font-size:13px; color:#7A5C1E; font-weight:600;">📍 ${data.cityName}</p></td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background-color:#FFFFFF; padding:0 40px 32px;">
            <table cellpadding="0" cellspacing="0" width="100%" style="border-top:2px solid ${gold}; margin-top:8px;">
              <tr><td style="padding:16px 0 8px;">
                <p style="margin:0; font-family:Arial,sans-serif; font-size:11px; letter-spacing:0.2em; color:${gold}; text-transform:uppercase; font-weight:600;">Sélection cliente</p>
              </td></tr>
              ${itemsHtml}
            </table>
          </td>
        </tr>

        <tr>
          <td style="background-color:${cream}; padding:24px 40px; border-top:1px solid #EDE8DF;">
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding:6px 0; font-family:Arial,sans-serif; font-size:14px; color:#6B5D50;">Sous-total</td>
                <td style="padding:6px 0; font-family:Arial,sans-serif; font-size:14px; color:${dark}; text-align:right;">${data.subtotal.toLocaleString("fr-MA")} MAD</td>
              </tr>
              ${
                data.discount > 0
                  ? `<tr>
                <td style="padding:6px 0; font-family:Arial,sans-serif; font-size:14px; color:#2E7D4F;">Remise pack</td>
                <td style="padding:6px 0; font-family:Arial,sans-serif; font-size:14px; color:#2E7D4F; text-align:right;">− ${data.discount.toLocaleString("fr-MA")} MAD</td>
              </tr>`
                  : ""
              }
              <tr>
                <td style="padding:6px 0; font-family:Arial,sans-serif; font-size:14px; color:#6B5D50;">Livraison</td>
                <td style="padding:6px 0; font-family:Arial,sans-serif; font-size:14px; color:${data.shipping === 0 ? "#2E7D4F" : dark}; text-align:right;">${data.shipping === 0 ? "Gratuite ✓" : data.shipping + " MAD"}</td>
              </tr>
              <tr><td colspan="2" style="padding-top:12px; border-top:1px solid #DDD0B8;"></td></tr>
              <tr>
                <td style="padding:8px 0; font-family:'Georgia',serif; font-size:18px; font-weight:700; color:${dark};">Total à encaisser</td>
                <td style="padding:8px 0; font-family:'Georgia',serif; font-size:22px; font-weight:700; color:${gold}; text-align:right;">${data.total.toLocaleString("fr-MA")} MAD</td>
              </tr>
              <tr><td colspan="2" style="padding-top:12px;">
                <div style="background-color:#FFF8EC; border:1px solid #E8D5A3; border-radius:4px; padding:10px 14px;">
                  <p style="margin:0; font-family:Arial,sans-serif; font-size:13px; color:#7A5C1E; font-weight:600;">🔒 Paiement à la livraison — colis créé automatiquement chez Forcelog</p>
                </div>
              </td></tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background-color:#FFFFFF; padding:28px 40px; border-top:1px solid #EDE8DF;">
            <p style="margin:0 0 16px; font-family:Arial,sans-serif; font-size:11px; letter-spacing:0.2em; color:${gold}; text-transform:uppercase; font-weight:600;">Livraison à</p>
            <p style="margin:0 0 4px; font-family:'Georgia',serif; font-size:15px; font-weight:600; color:${dark};">${data.customerName}</p>
            <p style="margin:0 0 4px; font-family:Arial,sans-serif; font-size:13px; color:#6B5D50;">📞 ${data.phone}</p>
            <p style="margin:0 0 4px; font-family:Arial,sans-serif; font-size:13px; color:#6B5D50;">📍 ${data.cityName}</p>
            <p style="margin:0; font-family:Arial,sans-serif; font-size:13px; color:#6B5D50;">${data.address}</p>
          </td>
        </tr>

        <tr>
          <td style="background-color:${dark}; padding:32px 40px; text-align:center; border-radius:0 0 8px 8px;">
            <p style="margin:0 0 12px; font-family:'Georgia',serif; font-size:16px; color:#FFFFFF; font-style:italic;">Notification automatique — Maison d'Or</p>
            <p style="margin:0; font-family:Arial,sans-serif; font-size:11px; color:#8C7B6A; line-height:1.6;">Maison d'Or · Bijoux &amp; Accessoires Femme · Maroc</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
