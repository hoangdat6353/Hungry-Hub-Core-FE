import Layout from '@components/layout/layout-two';
import Container from '@components/ui/container';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DownloadApps from '@components/common/download-apps';
import BundleGrid from '@components/bundle/bundle-grid';
import CollectionGrid from '@components/common/collection-grid';
import HeroBannerCard from '@components/hero/hero-banner-card';
import BestSellerGroceryProductFeed from '@components/product/feeds/best-seller-grocery-product-feed';
import PopularProductFeed from '@components/product/feeds/popular-product-feed';
import CategoryGridBlock from '@components/common/category-grid-block';
import { homeSixHeroBanner as heroBanner } from '@framework/static/banner';
import { homeSixBanner as banner } from '@framework/static/banner';
import BannerCard from '@components/cards/banner-card';
import { bundleDataTwo as bundle } from '@framework/static/bundle';
import { GetStaticProps } from 'next';
import Seo from '@components/seo/seo';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { fetchCategories } from '@framework/category/get-all-categories';
import { fetchBestSellerGroceryProducts } from '@framework/product/get-all-best-seller-grocery-products';
import { fetchPopularProducts } from '@framework/product/get-all-popular-products';
import { LIMITS } from '@framework/utils/limits';
import dynamic from 'next/dynamic';
import 'react-chat-widget/lib/styles.css';
import { CHATBOT_SIT_URL } from 'src/common/constants/api-constant';
export interface ResponseData {
  answer: string;
}
export default function Home() {
  const isSSR = typeof window === 'undefined';
  const imagePath = '/assets/images/linkicon.png'; // Adjust the path as needed

  const DynamicWidget = dynamic(
    () => import('react-chat-widget').then((mod) => mod.Widget),
    {
      ssr: false, // Load only on the client side
    }
  );

  const handleNewUserMessage = (newMessage: string) => {
    console.log(`New message incoming! ${newMessage}`);
    //const URL = 'http://127.0.0.1:10000/predict';

    // Send the user message to your API
    fetch(CHATBOT_SIT_URL, {
      method: 'POST',
      body: JSON.stringify({ message: newMessage }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json', // Add this line to indicate JSON response is accepted
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Add the response from the API to the chat UI
        const responseData = data as ResponseData;
        addResponseToWidget(responseData.answer);
      })
      .catch((error) => {
        console.error('Error:', error);
        //Handle error and display an error message in the chat UI
        addResponseToWidget(
          'Oops! Something went wrong. Please try again later.'
        );
      });
  };

  const addResponseToWidget = (text: string) => {
    if (typeof window !== 'undefined') {
      const { addResponseMessage } = require('react-chat-widget');
      addResponseMessage(text);
    }
  };

  return (
    <>
      <Seo
        title="Hungry Hub - Food Management"
        description="Food Management System"
        path="/"
      />
      <HeroBannerCard
        banner={heroBanner}
        className="hero-banner-six min-h-[400px] md:min-h-[460px] lg:min-h-[500px] xl:min-h-[650px] py-20 py:pt-24 mb-5 2xl:bg-center"
      />
      <Container>
        <BundleGrid
          className="mb-12 lg:mb-14 xl:mb-16 2xl:mb-20"
          data={bundle}
        />
        {process.browser && !isSSR && (
          <DynamicWidget
            handleNewUserMessage={handleNewUserMessage}
            title="Hungry Hub - Chatbot Service"
            subtitle="Hi how can I help you today?"
            showTimeStamp={true}
            profileAvatar={imagePath}
          />
        )}
        <CategoryGridBlock />
        <BestSellerGroceryProductFeed />
        <BannerCard
          banner={banner}
          className="mb-12 lg:mb-14 xl:pb-3"
          effectActive={false}
        />
        <PopularProductFeed />
      </Container>
      <CollectionGrid
        headingPosition="center"
        className="xl:pt-2 2xl:pt-4 3xl:pt-6 pb-1 lg:pb-0 mb-12 lg:mb-14 xl:mb-16 2xl:mb-20"
      />
      <DownloadApps />
    </>
  );
}

Home.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [API_ENDPOINTS.CATEGORIES, { limit: LIMITS.CATEGORIES_LIMITS }],
    fetchCategories
  );
  await queryClient.prefetchQuery(
    [
      API_ENDPOINTS.BEST_SELLER_GROCERY_PRODUCTS,
      { limit: LIMITS.BEST_SELLER_GROCERY_PRODUCTS_LIMITS },
    ],
    fetchBestSellerGroceryProducts
  );
  await queryClient.prefetchQuery(
    [API_ENDPOINTS.POPULAR_PRODUCTS, { limit: LIMITS.POPULAR_PRODUCTS_LIMITS }],
    fetchPopularProducts
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      ...(await serverSideTranslations(locale!, [
        'common',
        'forms',
        'menu',
        'footer',
      ])),
    },
    revalidate: 60,
  };
};
