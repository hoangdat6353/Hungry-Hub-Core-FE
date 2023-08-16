import StripePaymentForm from '@components/common/form/stripe-inline-form';
import { useCart } from '@contexts/cart/cart.context';
import { RadioGroup } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useState, useEffect } from 'react';

const StripeCheckoutInlineForm = () => {
  const { t } = useTranslation();
  const { total } = useCart();
  const [selected, setSelected] = useState('Cash on delivery');

  return (
    <>
      <div className="text-[15px] text-skin-base">
        <RadioGroup
          value={selected}
          onChange={setSelected}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-auto"
        >
          <RadioGroup.Label className="sr-only">
            {t('text-default')}
          </RadioGroup.Label>

          <RadioGroup.Option
            value={'Cash on delivery'}
            className={({ active, checked }) =>
              `${active ? 'border-skin-primary' : 'border-skin-base'}
              ${checked ? 'border-skin-primary' : 'border-skin-base'}
              border-2 relative shadow-md focus:outline-none rounded p-5 block cursor-pointer min-h-[112px] h-full group address__box`
            }
          >
            <RadioGroup.Label as="h2" className="font-semibold mb-2">
              {t('text-pay-cash')}
            </RadioGroup.Label>
            <RadioGroup.Description as="div" className="opacity-70">
              {t('text-pay-cash-description')}
            </RadioGroup.Description>
          </RadioGroup.Option>
        </RadioGroup>
      </div>
    </>
  );
};

export default StripeCheckoutInlineForm;
