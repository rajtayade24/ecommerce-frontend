// src/pages/admin/ProductForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { getAllCategories } from "@/service/userService";
import { useProduct } from "@/hooks/useProduct";
import { getProductById } from "@/service/userService";
import { useCategory } from "@/hooks/useCategory";
import { toast } from "@/components/ui/Sonner";

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
  const [catImageFile, setCatImageFile] = useState(null);
  const [catImagePreview, setCatImagePreview] = useState("");
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");

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
    if (category && allCategories.length) {
      setCategory(String(category));
    }
  }, [category, allCategories]);

  function handleCatImageSelect(e) {
    const file = e.target.files[0];
    if (file) {
      setCatImageFile(file);
      setCatImagePreview(URL.createObjectURL(file));
    }
  }

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

  // ---------- variant helpers (replace existing ones) ----------
  function addVariant(initial = { value: "", unit: "", price: "", stock: 0, customValue: "", customUnit: "" }) {
    setVariants((v) => [...v, initial]);
  }

  function updateVariant(index, field, value) {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function removeVariant(index) {
    if (variants.length === 1) {
      toast.warning("At lease one variant is required!!")
      return;
    }
    setVariants((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  }

  function copyBelow(index) {
    setVariants((prev) => {
      const copy = [...prev];
      const item = { ...copy[index] };
      // clone deep-ish so custom fields don't point to same ref
      const clone = { ...item, customValue: item.customValue ?? "", customUnit: item.customUnit ?? "" };
      copy.splice(index + 1, 0, clone);
      return copy;
    });
  }

  useEffect(() => {
    const fetchAllCategories = async () => {
      setAllCategories(await getAllCategories())
    }
    fetchAllCategories()
  }, [])

  const {
    postCategoryMutation,
  } = useCategory()

  async function handleSubmit(e) {
    e.preventDefault();

    if (!slug.trim()) return toast.warning("Product slug is required");
    if (!category) return toast.warning("Category is required");
    if (images.length === 0) return toast.warning("images is required");
    if (variants.length === 0) return toast.warning("At least one variant required");
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.value) return toast.warning(`Variant ${i + 1}: value is required`);
      if (!v.unit.trim()) return toast.warning(`Variant ${i + 1}: unit is required`);
      if (!v.price || Number(v.price) <= 0) return toast.warning(`Variant ${i + 1}: price is required`);
      if (!v.stock || Number(v.stock) <= 0) return toast.warning(`Variant ${i + 1}: stock is required`);
    }

    if (isOtherCategory) {
      if (!catSlug.trim()) return toast.warning("Category ID is required");
      if (!catName.trim()) return toast.warning("Category name is required");
      if (!catImageFile) return toast.warning("Category image is required");

      const catPayload = {
        slug: catSlug
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        catName,
        description: catDesc,
      };

      try {
        const result = await postCategoryMutation.mutateAsync({
          category: catPayload,
          image: catImageFile,
        });

        setCategory(String(result.id));
      } catch (err) {
        console.error(err);
      } finally {
      }
    }

    const payload = {
      slug: slug
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
      name: name.replaceAll('"', "").replaceAll(",", ""),
      description: description.replaceAll('"', "").replaceAll(",", ""),
      category: Number(category)
      , isFeatured,
      isOrganic,

      nutrition: {
        calories: nutrition.calories
          ? (nutrition.calories.includes("per")
            ? nutrition.calories.replaceAll('"', "").replaceAll(",", "")
            : nutrition.calories.replaceAll('"', "").replaceAll(",", "") + " per 100 g")
          : "",
        protein: nutrition.protein
          ? (nutrition.protein.includes("per")
            ? nutrition.protein.replaceAll('"', "").replaceAll(",", "")
            : nutrition.protein.replaceAll('"', "").replaceAll(",", "") + " per 100 g")
          : "",
        carbs: nutrition.carbs
          ? (nutrition.carbs.includes("per")
            ? nutrition.carbs.replaceAll('"', "").replaceAll(",", "")
            : nutrition.carbs.replaceAll('"', "").replaceAll(",", "") + " per 100 g")
          : "",
        fiber: nutrition.fiber
          ? (nutrition.fiber.includes("per")
            ? nutrition.fiber.replaceAll('"', "").replaceAll(",", "")
            : nutrition.fiber.replaceAll('"', "").replaceAll(",", "") + " per 100 g")
          : "",
        vitamins: nutrition?.vitamins
          ?.split(",")
          .map((s) => s.trim().replaceAll('"', ""))
          .filter(Boolean),
      },

      variants: variants.map((v) => ({
        value: v.value === "__other__" ? (v.customValue || "") : v.value,
        unit: v.unit === "__other__" ? (v.customUnit || "") : v.unit,
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
      <form onSubmit={handleSubmit} encType="multipart/form-data" className=" rounded-2xl shadow-sm p-4 space-y-6">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input name="name" value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Fresh Vegetables" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category ID</label>
                  <Input name="slug" value={catSlug} onChange={(e) => setCatSlug(e.target.value)} placeholder="e.g. vegetables" />
                  <p className="text-xs text-muted-foreground mt-1">
                    This becomes the slug (used in URL & filtering).
                  </p>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium mb-1">Category Description</label>
                  <Textarea name="description" value={catDesc} rows={3} onChange={(e) => setCatDesc(e.target.value)} />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium mb-1">Category Image</label>
                  <Input name="image" type="file" accept="image/*" multiple onChange={handleCatImageSelect} />
                  {catImagePreview && (
                    <div className="mt-3">
                      <img src={catImagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg border" />
                    </div>
                  )}
                </div>
              </div>
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
              required={!isEdit}
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

            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div key={idx} className="rounded-xl border p-3">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    {/* Value - Select with Other */}
                    <div className="col-span-3">
                      <label className="block text-xs mb-1">Value</label>
                      <Select
                        value={v.value || ""}
                        onValueChange={(val) => {
                          if (val === "__other__") {
                            updateVariant(idx, "value", "__other__");
                            updateVariant(idx, "customValue", "");
                          } else {
                            updateVariant(idx, "value", val);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full rounded-xl">
                          <SelectValue placeholder="Select value" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* example preset values - adjust to your domain */}
                          <SelectItem value="250">100</SelectItem>
                          <SelectItem value="250">250</SelectItem>
                          <SelectItem value="500">500</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="__other__">Other (type)</SelectItem>
                        </SelectContent>
                      </Select>

                      {v.value === "__other__" && (
                        <Input
                          className="mt-2"
                          placeholder="Custom value (e.g. '500 ml')"
                          value={v.customValue || ""}
                          onChange={(e) => updateVariant(idx, "customValue", e.target.value)}
                        />
                      )}
                    </div>

                    {/* Unit - Select with Other */}
                    <div className="col-span-2">
                      <label className="block text-xs mb-1">Unit</label>
                      <Select
                        value={v.unit || ""}
                        onValueChange={(val) => {
                          if (val === "__other__") {
                            updateVariant(idx, "unit", "__other__");
                            updateVariant(idx, "customUnit", "");
                          } else {
                            updateVariant(idx, "unit", val);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full rounded-xl">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pcs">pcs</SelectItem>
                          <SelectItem value="pack">pack</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="__other__">Other</SelectItem>
                        </SelectContent>
                      </Select>

                      {v.unit === "__other__" && (
                        <Input
                          className="mt-2"
                          placeholder="Custom unit (e.g. 'bunch')"
                          value={v.customUnit || ""}
                          onChange={(e) => updateVariant(idx, "customUnit", e.target.value)}
                        />
                      )}
                    </div>

                    {/* Price */}
                    <div className="col-span-3">
                      <label className="block text-xs mb-1">Price</label>
                      <Input
                        type="number"
                        value={v.price ?? ""}
                        onChange={(e) => updateVariant(idx, "price", e.target.value)}
                        placeholder="price"
                        required
                      />
                    </div>

                    {/* Stock */}
                    <div className="col-span-2">
                      <label className="block text-xs mb-1">Stock</label>
                      <Input
                        type="number"
                        value={v.stock ?? 0}
                        onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                        placeholder="stock"
                        required
                      />
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => copyBelow(idx)}
                        className="text-sm px-3 py-1 rounded-md border hover:bg-gray-50"
                        title="Duplicate variant"
                      >
                        Duplicate
                      </button>

                      <button
                        type="button"
                        onClick={() => removeVariant(idx)}
                        className="text-sm px-3 py-1 rounded-md border text-red-600 hover:bg-red-50"
                        title="Remove variant"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() =>
                    addVariant({ value: "", unit: "", price: "", stock: 0, customValue: "", customUnit: "" })
                  }
                >
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
