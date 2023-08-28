import { i18n } from 'next-i18next';
import { useMemo } from 'react';

export function formatPrice({
  amount,
  code,
  locale,
}: {
  amount: number;
  code: string;
  locale: string;
}) {
  const formatCurrency = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 0, // Don't show any decimals
    maximumFractionDigits: 0, // Don't show any decimals
  });

  const formattedAmount = formatCurrency.format(amount);

  if (code == 'VND') {
    return formattedAmount.replace('₫', 'vnđ');
  } else {
    return formattedAmount;
  }
}

export function formatVariantPrice({
  amount,
  baseAmount,
  code,
  locale,
}: {
  baseAmount: number;
  amount: number;
  code: string;
  locale: string;
}) {
  const hasDiscount = baseAmount > amount;
  const formatDiscount = new Intl.NumberFormat(locale, { style: 'percent' });
  const discount = hasDiscount
    ? formatDiscount.format((baseAmount - amount) / baseAmount)
    : null;

  const price = formatPrice({ amount, code, locale });
  const basePrice = hasDiscount
    ? formatPrice({ amount: baseAmount, code, locale })
    : null;

  return { price, basePrice, discount };
}

export default function usePrice(
  data?: {
    amount: number;
    baseAmount?: number;
    currencyCode: string;
  } | null
) {
  const { amount, baseAmount, currencyCode } = data ?? {};
  const currentLang = i18n?.language;

  let locale = '';
  let code = '';
  if (currentLang == 'vn') {
    locale = 'vi-VN';
    code = 'VND';
  } else {
    locale = 'en';
    code = 'USD';
  }

  const value = useMemo(() => {
    if (typeof amount !== 'number' || !currencyCode) return '';

    return baseAmount
      ? formatVariantPrice({ amount, baseAmount, code, locale })
      : formatPrice({ amount, code, locale });
  }, [amount, baseAmount, currencyCode]);

  return typeof value === 'string'
    ? { price: value, basePrice: null, discount: null }
    : value;
}
