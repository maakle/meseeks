import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { ProductListingPage } from "@/features/products/components/product-listing";
import { ProductView } from "@/features/products/components/product-view";
import { searchParamsCache } from "@/lib/searchparams";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

export const metadata = {
  title: "Dashboard: Products",
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  // const key = serialize({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Products"
            description="Manage products and their details"
          />
          <ProductView />
        </div>
        <Suspense
          // key={key}
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          {await ProductListingPage()}
        </Suspense>
      </div>
    </PageContainer>
  );
}
