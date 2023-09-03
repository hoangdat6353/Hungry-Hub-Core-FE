import { OrderDetailsContent } from './order-details-content';
import { notificationController } from '@components/controllers/notificationController';
import OrderStatus from './order-status';
import {
  DiscountPrice,
  DeliveryFee,
  TotalPrice,
  SubTotalPrice,
} from '@components/order/price';

import { useUI } from '@contexts/ui.context';
import { useTranslation } from 'next-i18next';
import {
  LOCAL_BASE_URL,
  LOCAL_PRODUCTS_CONTROLLER,
} from 'src/common/constants/api-constant';

const OrderDrawer: React.FC = () => {
  const { data, closeDrawer } = useUI();
  const { t } = useTranslation('common');

  const onClose = () => {
    const orderId = data.id;

    const deleteOrderURL =
      LOCAL_BASE_URL + LOCAL_PRODUCTS_CONTROLLER + '/order/' + orderId;

    fetch(deleteOrderURL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json', // Add this line to indicate JSON response is accepted
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Add the response from the API to the chat UI
        notificationController.success({ message: 'Xóa đơn hàng hoàn tất' });
        return closeDrawer();
      })
      .catch((error) => {
        notificationController.success({
          message: 'Có lỗi xảy ra xóa đơn hàng thất bại',
        });
        console.error('Error:', error);
        //Handle error and display an error message in the chat UI
      });
    return closeDrawer();
  };

  let { shipping_address } = data;

  return (
    <>
      {data !== '' && (
        <>
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-8">
              {t('text-order-details')}
            </h2>
            <div className="text-[14px] opacity-70 mb-3 text-skin-base">
              {t('text-delivery-address')}
            </div>
            <div className="rounded border border-solid min-h-[90px] bg-skin-two p-4 border-skin-two text-[12px] md:text-[14px]">
              <p className="text-skin-base opacity-70">
                {shipping_address.shipping_address}
              </p>
            </div>
            <OrderStatus status={data?.status?.serial} />
            <div className="grid grid-cols-12 bg-skin-two py-3 rounded-[3px] text-black text-[12px] md:text-[14px]">
              <div className="col-span-2 opacity-50"></div>
              <div className="col-span-5 opacity-50">
                {t('text-items-name')}
              </div>
              <div className="col-span-3 opacity-50 md:text-start text-center">
                {t('text-quantity')}
              </div>
              <div className="col-span-2 opacity-50">Price</div>
            </div>
            {data?.products?.map((item: any, index: string) => (
              <OrderDetailsContent key={index} item={item} />
            ))}
            <div className="mt-3 text-end">
              <div className="text-black inline-flex flex-col text-[12px] md:text-[14px]">
                <div className="mb-2 pb-1 border-b border-skin-base ps-20">
                  <p className="flex justify-between mb-1">
                    <span className="me-8">{t('text-sub-total')}: </span>
                    <span className="font-medium">
                      <SubTotalPrice items={data?.products} />
                    </span>
                  </p>
                  {typeof data?.discount === 'number' && (
                    <p className="flex justify-between mb-2">
                      <span className="me-8">{t('text-discount')}: </span>
                      <span className="font-medium">
                        <DiscountPrice discount={data?.discount} />
                      </span>
                    </p>
                  )}
                  {typeof data?.delivery_fee === 'number' && (
                    <p className="flex justify-between mb-2">
                      <span className="me-8">{t('text-delivery-fee')}:</span>
                      <span className="font-medium">
                        <DeliveryFee delivery={data?.delivery_fee} />
                      </span>
                    </p>
                  )}
                </div>
                <p className="flex justify-between ps-20 mb-2">
                  <span className="me-8">{t('text-total-cost')}:</span>
                  <span className="font-medium">
                    <TotalPrice items={data} />
                  </span>
                </p>
              </div>
            </div>
            <div className="text-end mt-12">
              <span
                onClick={onClose}
                className="py-3 px-5 cursor-pointer inline-block text-[12px] md:text-[14px] text-white font-medium bg-[#F35C5C] rounded border border-solid border-[#F35C5C]  hover:bg-white hover:text-black hover:border-[#DEE5EA] transition-all capitalize"
              >
                {t('text-cancel-order')}
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderDrawer;
