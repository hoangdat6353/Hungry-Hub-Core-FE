import { ILFlag } from '@components/icons/language/ILFlag';
import { SAFlag } from '@components/icons/language/SAFlag';
import { CNFlag } from '@components/icons/language/CNFlag';
import { USFlag } from '@components/icons/language/USFlag';
import { DEFlag } from '@components/icons/language/DEFlag';
import { ESFlag } from '@components/icons/language/ESFlag';
import { VNFlag } from '@components/icons/language/VNFlag';

export const siteSettings = {
  name: 'Hungry Hub',
  description: 'Hungry Hub - Food Management System.',
  author: {
    name: 'TDTU Students - Hoàng Đạt - Quốc Anh',
    websiteUrl: '',
    address: '',
  },
  logo: {
    url: '/assets/images/logo-header.svg',
    alt: 'HungryHub',
    href: '/',
    width: 128,
    height: 30,
  },
  defaultLanguage: 'en',
  currencyCode: 'USD',
  site_header: {
    menu: [
      {
        id: 1,
        path: '/',
        label: 'menu-home',
      },
      {
        id: 2,
        path: '/search',
        label: 'menu-categories',
        subMenu: [
          {
            id: 1,
            path: '/search',
            label: 'menu-fresh-vegetables',
          },
          {
            id: 2,
            path: '/search',
            label: 'menu-diet-nutrition',
          },
          {
            id: 3,
            path: '/search',
            label: 'menu-healthy-foods',
          },
          {
            id: 4,
            path: '/search',
            label: 'menu-grocery-items',
          },
          {
            id: 5,
            path: '/search',
            label: 'menu-beaf-steak',
          },
        ],
      },
      {
        id: 3,
        path: '/search/',
        label: 'menu-search',
      },
      {
        id: 4,
        path: '/about-us/',
        label: 'menu-about-us',
      },
      {
        id: 5,
        path: '/faq/',
        label: 'menu-faq',
      },
    ],
    languageMenu: [
      {
        id: 'vn',
        name: 'Vietnam - VN',
        value: 'vn',
        icon: <VNFlag />,
      },
      {
        id: 'en',
        name: 'English - EN',
        value: 'en',
        icon: <USFlag />,
      },
    ],
  },
};
