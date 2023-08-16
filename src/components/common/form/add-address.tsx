import Input from '@components/ui/form/input';
import Button from '@components/ui/button';
import TextArea from '@components/ui/form/text-area';
import { useForm } from 'react-hook-form';
import { useModalState } from '@components/common/modal/modal.context';
import { useModalAction } from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import Heading from '@components/ui/heading';
import Map from '@components/ui/map';
import { useTranslation } from 'next-i18next';
import {
  LOCAL_BASE_URL,
  LOCAL_USERS_CONTROLLER,
} from 'src/common/constants/api-constant';
import { decodeToken, getToken } from '@framework/utils/get-token';
import {
  BaseResponse,
  BaseStatusResponse,
} from 'src/common/models/auth-models';
import { useAddressQuery } from '@framework/address/address';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery, useQueryClient } from 'react-query';

interface ContactFormValues {
  title: string;
  default: boolean;
  lat: number;
  lng: number;
  formatted_address: string;
}

interface CreateAddressRequestModel {
  id: string;
  default: boolean;
  title: string;
  formatted_address: string;
}

const AddAddressForm: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useModalState();
  const queryClient = useQueryClient();

  const { closeModal } = useModalAction();

  async function onSubmit(values: ContactFormValues, e: any) {
    const userToken = getToken();

    if (userToken != null) {
      const decodedToken = decodeToken(userToken);
      const userId = decodedToken?.id;

      const createAddressURL =
        LOCAL_BASE_URL + LOCAL_USERS_CONTROLLER + '/address';

      const requestModel: CreateAddressRequestModel = {
        id: userId as string,
        default: false,
        title: values.title,
        formatted_address: values.formatted_address,
      };

      const response = await fetch(createAddressURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestModel),
      });

      if (!response.ok) {
        // Handle error responses
        throw new Error('CREATE ADDRESS failed');
      }

      const data: BaseResponse<BaseStatusResponse> = await response.json();
      queryClient.invalidateQueries(
        LOCAL_BASE_URL + LOCAL_USERS_CONTROLLER + '/' + userId + '/' + 'address'
      );
      //const isSuccess = data.data.isSuccess;
    }

    closeModal();
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      title: data || data?.title ? data?.title : '',
      default: data || data?.default ? data?.default : '',
      formatted_address:
        data || data?.address?.formatted_address
          ? data?.address?.formatted_address
          : '',
    },
  });

  return (
    <div className="w-full md:w-[600px] lg:w-[900px] xl:w-[1000px] mx-auto p-5 sm:p-8 bg-skin-fill rounded-md">
      <CloseButton onClick={closeModal} />
      <Heading variant="title" className="mb-8 -mt-1.5">
        {t('common:text-add-delivery-address')}
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-6">
          <Input
            variant="solid"
            label="Address Title"
            {...register('title', { required: 'Title Required' })}
            error={errors.title?.message}
          />
        </div>
        <div className="grid grid-cols-1 mb-6 gap-7">
          <TextArea
            label="Address"
            {...register('formatted_address', {
              required: 'forms:address-required',
            })}
            error={errors.formatted_address?.message}
            className="text-skin-base"
            variant="solid"
          />
        </div>
        <div className="flex w-full justify-end">
          <Button className="h-11 md:h-12 mt-1.5" type="submit">
            {t('common:text-save-address')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressForm;
