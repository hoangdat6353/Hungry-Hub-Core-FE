import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { siteSettings } from '@settings/site-settings';
import { ROUTES } from '@utils/routes';
import { useUI } from '@contexts/ui.context';
import { addActiveScroll } from '@utils/add-active-scroll';
import Container from '@components/ui/container';
import Logo from '@components/ui/logo';
import UserIcon from '@components/icons/user-icon';
import MenuIcon from '@components/icons/menu-icon';
import HeaderMenu from '@components/layout/header/header-menu';
import LanguageSwitcher from '@components/ui/language-switcher';
import { useModalAction } from '@components/common/modal/modal.context';
import cn from 'classnames';
import Search from '@components/common/search';
import { Category } from '@framework/types';
import {
  LOCAL_BASE_URL,
  LOCAL_CATEGORIES_CONTROLLER,
} from 'src/common/constants/api-constant';
import { BaseResponse } from 'src/common/models/auth-models';
const AuthMenu = dynamic(() => import('./auth-menu'), { ssr: false });
const CartButton = dynamic(() => import('@components/cart/cart-button'), {
  ssr: false,
});

type DivElementRef = React.MutableRefObject<HTMLDivElement>;
const { site_header } = siteSettings;

type CategoryHeader = {
  id: string;
  path: string;
  label: string;
};

const transformCategoriesToMenu = (
  categories: Category[]
): CategoryHeader[] => {
  return categories.map((category) => ({
    id: category.id.toString(),
    path: `/search?q=${encodeURIComponent(category.name)}`,
    label: category.name,
  }));
};

type MenuItem = {
  id: string;
  path: string;
  label: string;
  subMenu?: CategoryHeader[];
};

const Header: React.FC = () => {
  const { openSidebar, isAuthorized, displayMobileSearch } = useUI();
  const { openModal } = useModalAction();
  const { t } = useTranslation('common');
  const siteHeaderRef = useRef() as DivElementRef;
  const [menuItems, setMenuItems] = useState<CategoryHeader[]>([]);

  const headerData: MenuItem[] = [
    {
      id: '1',
      path: '/',
      label: 'menu-home',
    },
    {
      id: '2',
      path: '/search',
      label: 'menu-categories',
      subMenu: menuItems,
    },
    {
      id: '4',
      path: '/about-us/',
      label: 'menu-about-us',
    },
    {
      id: '5',
      path: '/faq/',
      label: 'menu-faq',
    },
  ];

  useEffect(() => {
    async function fetchCategories() {
      try {
        const getAllCategoriesURL =
          LOCAL_BASE_URL + LOCAL_CATEGORIES_CONTROLLER + '/';
        const response = await fetch(getAllCategoriesURL);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data: BaseResponse<Category[]> = await response.json();
        const transformedMenuItems = transformCategoriesToMenu(data.data);
        setMenuItems(transformedMenuItems);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCategories();
  }, []);

  addActiveScroll(siteHeaderRef);
  function handleLogin() {
    openModal('LOGIN_VIEW');
  }
  function handleMobileMenu() {
    return openSidebar();
  }

  return (
    <header
      id="siteHeader"
      ref={siteHeaderRef}
      className={cn(
        'header-one w-full h-16 lg:h-20 z-30 sticky top-0',
        displayMobileSearch && 'active-mobile-search'
      )}
    >
      <div className="innerSticky body-font bg-skin-fill w-full h-16 lg:h-20 z-20 transition duration-200 ease-in-out">
        <Search className="top-bar-search lg:max-w-[600px] absolute z-30 px-4 md:px-6 top-1" />
        {/* End of Mobile search */}
        <Container className="flex items-center justify-between lg:justify-center h-full w-full">
          <button
            aria-label="Menu"
            className="menuBtn me-5 hidden lg:flex xl:hidden flex-col items-center justify-center flex-shrink-0 outline-none focus:outline-none"
            onClick={handleMobileMenu}
          >
            <MenuIcon />
          </button>

          <Logo className="-mt-1" />

          <HeaderMenu
            data={headerData}
            className="hidden xl:flex md:ps-6 xl:ps-10"
          />

          <div className="flex flex-shrink-0 space-s-5 xl:space-s-7 ms-auto">
            <LanguageSwitcher />
            <CartButton className="hidden lg:flex" />
            <div className="hidden lg:flex items-center flex-shrink-0 ">
              <UserIcon className="text-skin-base text-opacity-40" />
              <AuthMenu
                isAuthorized={isAuthorized}
                href={ROUTES.ACCOUNT}
                btnProps={{
                  children: t('text-sign-in'),
                  onClick: handleLogin,
                }}
              >
                {t('text-account')}
              </AuthMenu>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Header;
