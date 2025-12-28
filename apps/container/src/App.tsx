import React, { Suspense } from "react";

const ProductList = React.lazy(() => import("products/ProductList"));

export default function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Container Host</h1>

      <Suspense fallback={<div>Loading remote…</div>}>
        <ProductList />
      </Suspense>
    </div>
  );
}
