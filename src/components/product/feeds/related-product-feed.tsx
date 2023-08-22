import ProductsCarousel from '@components/product/products-carousel';
import { useRelatedProductsQuery } from '@framework/product/get-related-product';
import { Product } from '@framework/types';
import { LIMITS } from '@framework/utils/limits';
import { useRouter } from 'next/router';

interface RelatedProductsProps {
  carouselBreakpoint?: {} | any;
  className?: string;
  uniqueKey?: string;
  productData?: Product;
}

const RelatedProductFeed: React.FC<RelatedProductsProps> = ({
  carouselBreakpoint,
  className,
  uniqueKey = 'related-product-popup',
  productData,
}) => {
  const router = useRouter();
  const {
    query: { slug },
  } = router;

  const query = (productData == undefined || productData == null) ? slug : productData.id

  const { data, isLoading, error } = useRelatedProductsQuery(
    query as string, // Use optional chaining to prevent accessing undefined id
    {
      limit: LIMITS.RELATED_PRODUCTS_LIMITS,
    }
  );

  return (
    <ProductsCarousel
      sectionHeading="text-related-products"
      categorySlug="/search"
      className={className}
      products={data}
      loading={isLoading}
      error={error?.message}
      limit={LIMITS.RELATED_PRODUCTS_LIMITS}
      uniqueKey={uniqueKey}
      carouselBreakpoint={carouselBreakpoint}
    />
  );
};

export default RelatedProductFeed;
