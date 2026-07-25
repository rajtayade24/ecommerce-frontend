import React from "react";
import AdminProductsSeeder from "./AdminProductsSeeder";

import products from "./products.json";
import productVariants from "./product_variants.json";
import productNutritionVitamins from "./product_nutrition_vitamins.json";
import categories from "./categories.json";

const TestPage = () => {
  return (
    <div className="flex container">
      <AdminProductsSeeder
        products={products}
        productVariants={productVariants}
        productNutritionVitamins={productNutritionVitamins}
        categories={categories}
        apiUrl="/admin/products/bulk"
      />
    </div>
  );
};

export default TestPage;