import type { Order } from "@/types/database";

export function downloadInvoice(order: Order) {
  const formatPrice = (n: number) =>
    new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(n);

  const itemsHtml = (order.items || [])
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${item.title}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${formatPrice(item.unit_price)}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${formatPrice(item.unit_price * item.quantity)}</td></tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Invoice #${order.id.slice(0, 8)}</title>
<style>body{font-family:Arial,sans-serif;max-width:720px;margin:40px auto;color:#030436}h1{color:#0a0c82}table{width:100%;border-collapse:collapse;margin:24px 0}th{text-align:left;font-size:11px;text-transform:uppercase;color:#666;padding:8px 0;border-bottom:2px solid #0a0c82}</style>
</head><body>
<h1>EMPC-AMANI</h1>
<p><strong>Invoice</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
<p>Date: ${new Date(order.created_at).toLocaleDateString()}<br>
Customer: ${order.customer_name}<br>
Email: ${order.customer_email}</p>
${order.shipping_address ? `<p>Ship to: ${order.shipping_address}</p>` : ""}
<table><thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Total</th></tr></thead><tbody>${itemsHtml}</tbody></table>
<p style="text-align:right;font-size:18px"><strong>Total: ${formatPrice(order.total)}</strong></p>
<p style="font-size:12px;color:#666">Payment: ${order.payment_status} · Status: ${order.status}</p>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `empc-invoice-${order.id.slice(0, 8)}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
