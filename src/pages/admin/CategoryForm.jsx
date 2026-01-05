import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCategory } from "../../hooks/useCategory";

// Mock fetch for edit (replace with real API later)
async function mockFetchCategory(id) {
  return new Promise((res) =>
    setTimeout(
      () =>
        res({
          id,
          name: "Fresh Vegetables",
          description: "Garden fresh vegetable selection",
          imageUrl: "https://via.placeholder.com/150",
        }),
      300
    )
  );
}

export default function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id) && id !== "new";

  const [catId, setCatId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    let mounted = true;

    mockFetchCategory(id).then((cat) => {
      if (!mounted) return;
      setCatId(cat.id);
      setName(cat.name);
      setDescription(cat.description);
      setImagePreview(cat.imageUrl);
    });

    return () => (mounted = false);
  }, [id, isEdit]);

  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  const {
    categories,
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    postCategoryMutation,
    deleteCategoryMutation,
    refetch,

  } = useCategory()

  async function handleSubmit(e) {
    e.preventDefault();

    if (!catId.trim()) return alert("Category ID is required");
    if (!name.trim()) return alert("Category name is required");
    if (!isEdit && !imageFile) return alert("Category image is required");

    const payload = {
      slug: catId.toLowerCase().replace(/\s+/g, "-"),
      name,
      description,
    };

    try {
      postCategoryMutation.mutate({ category: payload, image: imageFile });

      navigate("/admin/categories");
    } catch (err) {
      console.error(err);
    } finally {
    }
  }

  if (isLoading) return <div> Loading....</div>
  if (isError) return <div> error</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{isEdit ? "Edit Category" : "Create Category"}</h1>
          <p className="text-sm text-muted-foreground">Fill category details and save.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={() => document.getElementById("cat-form-submit").click()}>Save</Button>
        </div>
      </div>

      <form

        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6 space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fresh Vegetables" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category ID</label>
            <Input name="slug" value={catId} onChange={(e) => setCatId(e.target.value)} placeholder="e.g. vegetables" />
            <p className="text-xs text-muted-foreground mt-1">
              This becomes the slug (used in URL & filtering).
            </p>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea name="description" value={description} rows={3} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-1">Category Image</label>
            <Input name="image" type="file" accept="image/*" onChange={handleImageSelect} />
            {imagePreview && (
              <div className="mt-3">
                <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg border" />
              </div>
            )}
          </div>
        </div>

        <button id="cat-form-submit" type="submit" className="hidden">Save</button>
      </form>
    </div>
  );
}
