"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { PageHeader, Input, Select, Textarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { adminJson } from "@/lib/admin-api";
import { formatPrice } from "@/lib/utils";

type Order = {
  id: string;
  customerName: string;
  phone: string;
  status: string;
  totalAmount: number;
  currency: string;
  items: Array<{ productName: string; size: string; quantity: number }>;
  createdAt: string;
};

type ProductOption = {
  id: string;
  name: string;
  sku?: string;
  inventory?: Array<{ size: string; quantity: number }>;
};

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [whatsappNote, setWhatsappNote] = useState("");
  const [productId, setProductId] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("1");

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId]
  );

  const availableSizes = useMemo(() => {
    const inv = selectedProduct?.inventory || [];
    return inv.filter((row) => row.quantity > 0);
  }, [selectedProduct]);

  const loadOrders = () => {
    const q = status ? `?status=${status}` : "";
    return adminJson<Order[]>(`/api/orders${q}`).then(({ json }) =>
      setItems(json.data || [])
    );
  };

  const loadProducts = async () => {
    const { res, json } = await adminJson<ProductOption[]>(
      "/api/products/manage?status=PUBLISHED&pageSize=100"
    );
    if (res.ok && Array.isArray(json.data) && json.data.length) {
      setProducts(json.data);
      return;
    }

    const publicRes = await adminJson<ProductOption[]>("/api/products?pageSize=100");
    setProducts(publicRes.json.data || []);
  };

  useEffect(() => {
    loadOrders();
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!productId) {
      setSize("");
      return;
    }
    if (availableSizes.length && !availableSizes.some((row) => row.size === size)) {
      setSize(availableSizes[0].size);
    }
  }, [productId, availableSizes, size]);

  const updateStatus = async (id: string, next: string) => {
    setError("");
    setSuccess("");
    const { res, json } = await adminJson(`/api/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) {
      setError(json.error || "Update failed");
      return;
    }
    loadOrders();
  };

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const qty = Number(quantity);
    const { res, json } = await adminJson("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        customerName,
        phone,
        city: city || undefined,
        whatsappNote: whatsappNote || undefined,
        items: [{ productId, size, quantity: qty }],
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError(json.error || "Failed to create order");
      return;
    }

    setSuccess("Order created");
    setCustomerName("");
    setPhone("");
    setCity("");
    setWhatsappNote("");
    setProductId("");
    setSize("");
    setQuantity("1");
    loadOrders();
    loadProducts();
  };

  return (
    <>
      <PageHeader title="Orders" description="Confirm orders to decrement stock." />
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      {success ? <p className="mb-3 text-sm text-green-700">{success}</p> : null}

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-2xl border border-border bg-card p-5 md:grid-cols-2"
      >
        <Input
          placeholder="Customer name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
        <Input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        >
          <option value="">Select product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.sku ? ` · ${p.sku}` : ""}
            </option>
          ))}
        </Select>
        <Select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          required
          disabled={!productId}
        >
          <option value="">
            {productId
              ? availableSizes.length
                ? "Select size"
                : "No sizes in stock"
              : "Select product first"}
          </option>
          {availableSizes.map((row) => (
            <option key={row.size} value={row.size}>
              {row.size} ({row.quantity} left)
            </option>
          ))}
        </Select>
        <Input
          type="number"
          min={1}
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <Textarea
          placeholder="WhatsApp note (optional)"
          value={whatsappNote}
          onChange={(e) => setWhatsappNote(e.target.value)}
          rows={2}
          className="md:col-span-2"
        />
        <div className="md:col-span-2">
          <Button type="submit" disabled={submitting || !productId || !size}>
            {submitting ? "Creating…" : "Create order"}
          </Button>
        </div>
      </form>

      <div className="mb-4 flex gap-3">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-44">
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </Select>
        <Button type="button" variant="outline" onClick={loadOrders}>
          Filter
        </Button>
      </div>
      <ul className="space-y-3">
        {items.map((row) => (
          <li key={row.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {row.customerName} · {row.phone}
                </p>
                <p className="text-xs text-muted-foreground">
                  {row.status} · {formatPrice(row.totalAmount)}
                </p>
                <ul className="mt-2 text-sm text-muted-foreground">
                  {row.items.map((item, i) => (
                    <li key={i}>
                      {item.productName} · size {item.size} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => updateStatus(row.id, "CONFIRMED")}>
                  Confirm
                </Button>
                <Button type="button" variant="outline" onClick={() => updateStatus(row.id, "SHIPPED")}>
                  Ship
                </Button>
                <Button type="button" variant="outline" onClick={() => updateStatus(row.id, "CANCELLED")}>
                  Cancel
                </Button>
              </div>
            </div>
          </li>
        ))}
        {!items.length ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : null}
      </ul>
    </>
  );
}
