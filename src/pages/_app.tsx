import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ManagedUIContext } from '@contexts/ui.context';
import ManagedModal from '@components/common/modal/managed-modal';
import ManagedDrawer from '@components/common/drawer/managed-drawer';
import { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { ToastContainer } from 'react-toastify';
import { ReactQueryDevtools } from 'react-query/devtools';
import { appWithTranslation } from 'next-i18next';
import { DefaultSeo } from '@components/seo/default-seo';

// external
import 'react-toastify/dist/ReactToastify.css';

// base css file
import '@styles/scrollbar.css';
import '@styles/swiper-carousel.css';
import '@styles/custom-plugins.css';
import '@styles/tailwind.css';
import { getDirection } from '@utils/get-direction';
import { CHATBOT_SIT_URL } from 'src/common/constants/api-constant';
import { ResponseData } from '.';
import dynamic from 'next/dynamic';

const Noop: React.FC = ({ children }) => <>{children}</>;

const CustomApp = ({ Component, pageProps }: AppProps) => {
  const queryClientRef = useRef<any>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  const router = useRouter();
  const dir = getDirection(router.locale);
  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);
  const Layout = (Component as any).Layout || Noop;
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
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <ManagedUIContext>
          {process.browser && !isSSR && (
            <DynamicWidget
              handleNewUserMessage={handleNewUserMessage}
              title="Hungry Hub - Chatbot Service"
              subtitle="Hi how can I help you today?"
              showTimeStamp={true}
              profileAvatar={imagePath}
            />
          )}
          <>
            <DefaultSeo />
            <Layout pageProps={pageProps}>
              <Component {...pageProps} key={router.route} />
            </Layout>
            <ToastContainer />
            <ManagedModal />
            <ManagedDrawer />
          </>
        </ManagedUIContext>
      </Hydrate>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
};

export default appWithTranslation(CustomApp);
