import React, { useMemo, useState } from "react";
import { api } from "../service/api";
import { extractError } from "../utils/extractError";

const DEFAULT_CATEGORIES = [
  { id: 3, name: "dry fruits", slug: "dry-fruits" },
  { id: 2, name: "fresh vegetables", slug: "vegetable" },
  { id: 4, name: "fresh fruits", slug: "fruits" },
  { id: 5, name: "Exotic Selection", slug: "exotic-selection" },
];

function asArray(value, key) {
  if (Array.isArray(value)) return value;
  if (value && Array.isArray(value[key])) return value[key];
  return [];
}

function groupBy(items, keyFn) {
  const safeItems = Array.isArray(items) ? items : [];
  return safeItems.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function uniqNormalized(list = []) {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const normalized = String(item ?? "").trim().toUpperCase();
    if (!normalized) continue;
    if (!seen.has(normalized)) {
      seen.add(normalized);
      out.push(normalized);
    }
  }
  return out;
}

function normalizeLabel(label = "") {
  return String(label).trim().replace(/\s+/g, " ");
}

function normalizeProductRows({
  products = [],
  productVariants = [],
  productNutritionVitamins = [],
  categories = DEFAULT_CATEGORIES,
}) {
  const productArray = asArray(products, "products");
  const variantArray = asArray(productVariants, "product_variants");
  const vitaminArray = asArray(productNutritionVitamins, "product_nutrition_vitamins");
  const categoryArray = asArray(categories, "categories");

  const variantsByProduct = groupBy(variantArray, (v) => v.product_id);
  const vitaminsByProduct = groupBy(vitaminArray, (v) => v.product_id);
  const categoryById = categoryArray.reduce((acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  }, {});

  return productArray.map((product) => {
    const variants = (variantsByProduct[product.id] || []).map((variant) => ({
      id: variant.id,
      label: normalizeLabel(variant.label),
      price: Number(variant.price ?? 0),
      stock: Number(variant.stock ?? 0),
      value: Number(variant.value ?? 0),
      sku: normalizeLabel(variant.sku),
      unit: normalizeLabel(variant.unit),
    }));

    const vitamins = uniqNormalized(
      (vitaminsByProduct[product.id] || []).map((item) => item.vitamin)
    );

    const category = categoryById[product.category_id] || {
      id: product.category_id,
      name: "Unknown",
      slug: "unknown",
    };

    return {
      ...product,
      name: normalizeLabel(product.name),
      description: normalizeLabel(product.description),
      slug: normalizeLabel(product.slug),
      nutrition_calories: normalizeLabel(product.nutrition_calories),
      nutrition_carbs: normalizeLabel(product.nutrition_carbs),
      nutrition_fiber: normalizeLabel(product.nutrition_fiber),
      nutrition_protein: normalizeLabel(product.nutrition_protein),
      category,
      variants,
      vitamins,
    };
  });
}

function buildPayload(product) {
  return {
    category: product.category?.id ?? product.category_id ?? null,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.variants?.[0]?.price ?? null,
    unit: product.variants?.[0]?.unit ?? "",
    isFeatured: Boolean(product.is_featured),
    isOrganic: Boolean(product.is_organic),
    nutrition: {
      calories: product.nutrition_calories,
      carbs: product.nutrition_carbs,
      fiber: product.nutrition_fiber,
      protein: product.nutrition_protein,
    },
    variants: product.variants.map((variant) => ({
      label: variant.label,
      price: variant.price,
      stock: variant.stock,
      value: variant.value,
      sku: variant.sku,
      unit: variant.unit,
    })),
  };
}

function ProductCard({ product, selectedFile, onFileChange, status, uploading }) {
  const [previewUrl, setPreviewUrl] = React.useState("");

  React.useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              #{product.id}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {product.category?.name || "Unknown category"}
            </span>
            {product.is_featured ? (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Featured
              </span>
            ) : null}
            {product.is_organic ? (
              <span className="rounded-full bg-lime-50 px-3 py-1 text-xs font-semibold text-lime-700">
                Organic
              </span>
            ) : null}
          </div>

          <h3 className="mt-3 text-xl font-bold text-slate-900">{product.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{product.description}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">Slug</div>
              <div className="mt-1 text-sm font-medium text-slate-900">{product.slug}</div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Nutrition
              </div>
              <div className="mt-1 text-sm font-medium text-slate-900">
                {product.nutrition_calories}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Carbs / Fiber / Protein
              </div>
              <div className="mt-1 text-sm font-medium text-slate-900">
                {product.nutrition_carbs} • {product.nutrition_fiber} •{" "}
                {product.nutrition_protein}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Vitamins
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.vitamins.length ? (
                  product.vitamins.map((vitamin) => (
                    <span
                      key={vitamin}
                      className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
                    >
                      {vitamin}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">No vitamins</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Variants</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.length ? (
                product.variants.map((variant) => (
                  <span
                    key={variant.id}
                    className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                  >
                    {variant.label} · ₹{variant.price} · stock {variant.stock}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">No variants</span>
              )}
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <div className="aspect-square overflow-hidden rounded-2xl bg-white">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No image selected
              </div>
            )}
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">
              Choose one image for this product
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(product.id, e.target.files?.[0] || null)}
              className="mt-2 block w-full cursor-pointer rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:font-semibold file:text-white"
            />
          </label>

          <div className="mt-4 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
            <div className="text-xs uppercase tracking-wide text-slate-500">Status</div>
            <div className="mt-1 text-sm text-slate-700">
              {uploading ? "Uploading..." : status || "Ready"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductsSeeder({
  products = [],
  productVariants = [],
  productNutritionVitamins = [],
  categories = DEFAULT_CATEGORIES,
  apiUrl = "/admin/products/bulk",
  token = "",
}) {
  const rows = useMemo(
    () =>
      normalizeProductRows({
        products,
        productVariants,
        productNutritionVitamins,
        categories,
      }),
    [products, productVariants, productNutritionVitamins, categories]
  );

  const [search, setSearch] = useState("");
  const [selectedFiles, setSelectedFiles] = useState({});
  const [statusById, setStatusById] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((row) => {
      const haystack = [
        row.name,
        row.slug,
        row.description,
        row.category?.name,
        row.category?.slug,
        ...row.vitamins,
        ...row.variants.map((v) => v.label),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [rows, search]);

  const handleFileChange = (productId, file) => {
    setSelectedFiles((prev) => ({ ...prev, [productId]: file }));
    setStatusById((prev) => ({ ...prev, [productId]: "" }));
  };

  const handleSubmitAll = async () => {
    if (!rows.length) {
      console.log("❌ No rows found.");
      return;
    }


    console.log("✅ Total rows:", rows.length);


    // Check if every product has an image
    const missing = rows.filter((row) => !selectedFiles[row.id]);

    if (missing.length) {
      console.log("❌ Missing images for:", missing);

      setStatusById((prev) => ({
        ...prev,
        ...Object.fromEntries(
          missing.map((row) => [row.id, "Please choose an image first."])
        ),
      }));

      return;
    }

    console.log("✅ Every product has an image.");

    // Build payload
    const payloads = rows.map(buildPayload);

    console.log("📦 Payloads:");
    console.log(payloads);


    const formData = new FormData();

    formData.append(
      "products",
      new Blob([JSON.stringify(payloads)], {
        type: "application/json",
      })
    );

    console.log("✅ Products JSON added.");


    rows.forEach((row, index) => {
      const file = selectedFiles[row.id];

      if (file) {
        console.log(
          `🖼 Image ${index + 1}:`,
          file.name,
          file.type,
          file.size
        );

        formData.append("images", file, file.name);
      }
    });

    console.log("📤 FormData contents:");

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, value.name, value.type, value.size);
      } else {
        console.log(`${key}:`, value);
      }
    }
    try {
      console.log("🚀 Sending request...");

      setSubmitting(true);

      setStatusById(
        Object.fromEntries(rows.map((row) => [row.id, "Uploading..."]))
      );

      const response = await fetch(`http://localhost:8080/api${apiUrl}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type
        },
        body: formData,
      });

      console.log("✅ Response received.");
      console.log("Status:", response.status);
      console.log("OK:", response.ok);

      const responseText = await response.text();

      console.log("📩 Response Body:");
      console.log(responseText);

      if (!response.ok) {
        throw new Error(responseText || "Upload failed");
      }

      console.log("🎉 Upload Successful.");

      setStatusById(
        Object.fromEntries(
          rows.map((row) => [row.id, "Uploaded successfully."])
        )
      );
    } catch (error) {
      console.error("❌ Upload Failed");
      console.error(error);

      setStatusById(
        Object.fromEntries(
          rows.map((row) => [
            row.id,
            error.message || "Upload failed.",
          ])
        )
      );
    } finally {
      console.log("========== BULK UPLOAD END ==========");
      setSubmitting(false);
    }
  };

  // const handleSubmitAll = async () => {
  //   if (!rows.length) return;

  //   // Only take the first product
  //   const firstRow = rows[0];
  //   const payload = buildPayload(firstRow);

  //   const formData = new FormData();

  //   // Send only one product
  //   const jsonBlob = new Blob(
  //     [JSON.stringify([payload])],
  //     {
  //       type: "application/json"
  //     }
  //   );

  //   formData.append("products", jsonBlob);

  //   // Append image only if it exists
  //   const file = selectedFiles[firstRow.id];

  //   if (file) {
  //     formData.append("images", file, file.name);
  //   }

  //   try {
  //     setSubmitting(true);
  //     setStatusById({
  //       [firstRow.id]: "Uploading...",
  //     });

  //     for (const pair of formData.entries()) {
  //       console.log("data: ", pair[0], pair[1]);
  //     }

  //     const response = await fetch(`http://localhost:8080/api${apiUrl}`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`, // if you're using JWT
  //         // DON'T set Content-Type here
  //       },
  //       body: formData,
  //     });

  //     const data = await response.text(); // or response.json() if your API returns JSON

  //     console.log("Status:", response.status);
  //     console.log("Response:", data);

  //     if (!response.ok) {
  //       throw new Error(data);
  //     }

  //     setStatusById({
  //       [firstRow.id]: "Uploaded successfully.",
  //     });
  //   } catch (error) {
  //     const message = extractError(error, "Upload failed");

  //     console.log(message);

  //     setStatusById({
  //       [firstRow.id]: message,
  //     });
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Product Bulk Uploader</h1>
              <p className="mt-1 text-sm text-slate-600">
                Select one image for each product, keep category id in the payload, and
                send all products in one multipart request.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmitAll}
              disabled={submitting}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit all products"}
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product, slug, vitamin, category, or variant..."
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 md:max-w-xl"
            />

            <div className="flex flex-wrap gap-2">
              {asArray(categories, "categories").map((cat) => (
                <span
                  key={cat.id}
                  className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {filteredRows.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selectedFile={selectedFiles[product.id]}
              onFileChange={handleFileChange}
              status={statusById[product.id]}
              uploading={submitting}
            />
          ))}
        </div>

        {!filteredRows.length ? (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No matching products found.
          </div>
        ) : null}
      </div>
    </div>
  );
}
