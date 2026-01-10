// src/pages/admin/ProductForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { getAllCategories } from "@/service/userService";
import { useProduct } from "@/hooks/useProduct";
import { getProductById } from "@/service/userService";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id) && id !== "new";

  // main fields
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isOrganic, setIsOrganic] = useState(false);

  // Category fields
  const [allCategories, setAllCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [isOtherCategory, setOtherCategory] = useState(false);

  const [images, setImages] = useState([]);
  const [nutrition, setNutrition] = useState({
    calories: "",
    protein: "",
    carbs: "",
    fiber: "",
    vitamins: "", // comma-separated string
  });

  const [variants, setVariants] = useState([{ value: "", unit: "", price: "", stock: 0 }]);

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const p = await getProductById(id);

        // Populate form fields
        setSlug(p.slug || "");
        setName(p.name || "");
        setDescription(p.description || "");
        setIsFeatured(Boolean(p.featured));
        setIsOrganic(Boolean(p.organic));
        setCategory(p.category || null);

        setImages(p.images)

        const n = p.nutrition || {};
        setNutrition({
          calories: n.calories ?? "",
          protein: n.protein ?? "",
          carbs: n.carbs ?? "",
          fiber: n.fiber ?? "",
          vitamins: Array.isArray(n.vitamins) ? n.vitamins.join(", ") : n.vitamins ?? "",
        });

        if (Array.isArray(p.variants) && p.variants.length > 0) {
          setVariants(
            p.variants.map((v) => ({
              value: v.value ?? "",
              unit: v.unit ?? "",
              price: v.price ?? "",
              stock: v.stock ?? 0,
            }))
          );
        }

      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    fetchProduct();
  }, [id]);


  useEffect(() => {
    if (!category || !allCategories.length) return;
    const found = allCategories.find((c) => Number(c.id) === Number(category));
    if (found)
      setCategory(String(found.id));
  }, [allCategories]);

  const {
    isLoading,
    isError,
    postProductMutation,
    updateProductMutation
  } = useProduct()

  function handleImageSelect(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const mapped = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...mapped]);
  }

  function removeImageAt(index) {
    setImages((prev) => {
      const copy = [...prev];
      // revoke object URL if it's a file preview
      const item = copy[index];
      if (item?.file && item.url) URL.revokeObjectURL(item.url);
      copy.splice(index, 1);
      return copy;
    });
  }

  function updateNutrition(field, value) {
    setNutrition((n) => ({ ...n, [field]: value }));
  }

  function addVariant() {
    setVariants((v) => [...v, { value: "", unit: "", price: "", stock: 0 }]);
  }

  function updateVariant(index, field, value) {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function removeVariant(index) {
    setVariants((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  }

  useEffect(() => {
    const fetchAllCategories = async () => {
      setAllCategories(await getAllCategories())
    }
    fetchAllCategories()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault();

    if (!slug.trim()) return alert("Product slug is required");
    if (!category) return alert("Category is required");
    if (images.length === 0) return alert("images is required");
    if (variants.length === 0) return alert("At least one variant required");
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];

      if (!v.value) return alert(`Variant ${i + 1}: value is required`);
      if (!v.unit.trim()) return alert(`Variant ${i + 1}: unit is required`);
      if (!v.price || Number(v.price) <= 0) return alert(`Variant ${i + 1}: price is required`);
      if (!v.stock || Number(v.stock) <= 0) return alert(`Variant ${i + 1}: stock is required`);
    }
    const payload = {
      slug: slug.toLowerCase().replaceAll(/\s+/g, "-").replaceAll(",", ""),  // FIXED
      name: name.replaceAll('"', "").replaceAll(",", ""),
      description: description.replaceAll('"', "").replaceAll(",", ""),
      category: Number(category)
      , isFeatured,
      isOrganic,

      nutrition: {
        calories: nutrition.calories.replaceAll('"', "").replaceAll(",", ""),
        protein: nutrition.protein.replaceAll('"', "").replaceAll(",", ""),
        carbs: nutrition.carbs.replaceAll('"', "").replaceAll(",", ""),
        fiber: nutrition.fiber.replaceAll('"', "").replaceAll(",", ""),
        vitamins: nutrition?.vitamins.split(",")
          .map((s) => s.trim().replaceAll('"', ""))
          .filter(Boolean),
      },

      variants: variants.map((v) => ({
        value: v.value,
        unit: v.unit,
        price: v.price,
        stock: v.stock,
      })),
    };

    try {
      console.log("Submitting product:", payload);

      if (isEdit) {
        await updateProductMutation.mutateAsync({
          id: id,
          product: payload,
          images
        });
      } else {
        await postProductMutation.mutateAsync({
          product: payload,
          images
        });
      }

      navigate("/admin/products");

    } catch (err) {
      console.error(err);
    }
  }

  if (isLoading) return <div>Loading product...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{isEdit ? "Edit Product" : "Create Product"}</h1>
          <p className="text-sm text-muted-foreground">Fill product details and save.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button onClick={() => document.getElementById("product-form-submit").click()}>
            Save
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} encType="multipart/form-data" className=" rounded-2xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Organic Carrot" required />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-1">id (slug)</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. organic-carrot" required />
            <p className="text-xs text-muted-foreground mt-1">Used in URL — lowercase, dash separated.</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category ID</label>
            {allCategories.length > 0 ? (
              <Select
                value={isOtherCategory ? "other" : category || ""}
                onValueChange={(val) => {
                  if (val === "other") {
                    setOtherCategory(true);
                    setCategory("");
                  } else {
                    setOtherCategory(false);
                    setCategory(val);
                  }
                }}
                required
              >
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {allCategories.map((c, i) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}

                  <SelectItem value="other">Other (type below)</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              // if no category list, fallback to text input
              <Input
                type="text"
                placeholder="Enter category"
                value={category || ""}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setOtherCategory(true);
                }}
                className="rounded-xl"
                required
              />
            )}

            {/* Free text category input when Other selected */}
            {isOtherCategory && (
              <Input
                type="text"
                placeholder="Type your category"
                value={category || ""}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl mt-2"
                required
              />
            )}
          </div>

          {/* Flags */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
              <span className="text-sm">Featured</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isOrganic} onChange={(e) => setIsOrganic(e.target.checked)} />
              <span className="text-sm">Organic</span>
            </label>
          </div>

          {/* Description */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea value={description} rows={4} onChange={(e) => setDescription(e.target.value)} />
          </div>

          {/* Images */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-1">Images</label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              required
            />

            <div className="mt-3 flex gap-3 flex-wrap">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-28 h-20 rounded overflow-hidden border">
                  <img src={img.url ?? img} alt={`img-${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImageAt(idx)}
                    className="absolute top-1 right-1 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-medium mb-2">Nutrition</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs mb-1">Calories</label>
                <Input value={nutrition.calories} onChange={(e) => updateNutrition("calories", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs mb-1">Protein</label>
                <Input value={nutrition.protein} onChange={(e) => updateNutrition("protein", e.target.value)} placeholder="e.g. 0.9g" />
              </div>
              <div>
                <label className="block text-xs mb-1">Carbs</label>
                <Input value={nutrition.carbs} onChange={(e) => updateNutrition("carbs", e.target.value)} placeholder="e.g. 9.6g" />
              </div>
              <div>
                <label className="block text-xs mb-1">Fiber</label>
                <Input value={nutrition.fiber} onChange={(e) => updateNutrition("fiber", e.target.value)} placeholder="e.g. 2.8g" />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs mb-1">Vitamins (comma separated)</label>
                <Input value={nutrition.vitamins} onChange={(e) => updateNutrition("vitamins", e.target.value)} placeholder="e.g. A, K, C" />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-medium mb-2">Variants</h3>
            <div className="space-y-2">
              {variants.map((v, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <Input
                    className="col-span-3"
                    value={v.value}
                    onChange={(e) => updateVariant(idx, "value", e.target.value)}
                    placeholder="value"
                    required
                  />
                  <Input
                    className="col-span-2"
                    value={v.unit}
                    onChange={(e) => updateVariant(idx, "unit", e.target.value)}
                    placeholder="unit"
                    required
                  />
                  <Input
                    type="number"
                    className="col-span-3"
                    value={v.price}
                    onChange={(e) => updateVariant(idx, "price", e.target.value)}
                    placeholder="price"
                    required
                  />
                  <Input
                    type="number"
                    className="col-span-2"
                    value={v.stock}
                    onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                    placeholder="stock"
                    required
                  />
                  <button type="button" onClick={() => removeVariant(idx)} className="col-span-2 text-sm text-red-600">
                    Remove
                  </button>
                </div>
              ))}

              <div>
                <Button variant="outline" type="button" onClick={addVariant}>
                  Add Variant
                </Button>
              </div>
            </div>
          </div>
        </div>

        <button id="product-form-submit" type="submit" className="hidden">
          Save
        </button>
      </form>
    </div>
  );
}
