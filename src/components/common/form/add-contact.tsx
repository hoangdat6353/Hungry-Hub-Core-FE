import CloseButton from '@components/ui/close-button';
import Input from '@components/ui/form/input';
import Button from '@components/ui/button';
import { useForm } from 'react-hook-form';
import {
  useModalState,
  useModalAction,
} from '@components/common/modal/modal.context';
import { useTranslation } from 'next-i18next';
import { getUserId } from '@framework/utils/get-token';
import {
  LOCAL_BASE_URL,
  LOCAL_USERS_CONTROLLER,
} from 'src/common/constants/api-constant';
import {
  BaseResponse,
  BaseStatusResponse,
} from 'src/common/models/auth-models';
import { useQueryClient } from 'react-query';
import { useContactQuery } from '@framework/contact/contact';

interface ContactFormValues {
  title: string;
  number: string;
  default: boolean;
}

const AddContactForm: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useModalState();
  const { closeModal } = useModalAction();
  const { refetch } = useContactQuery();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      title: data || data?.title ? data?.title : '',
      number: data || data?.number ? data?.number : '',
      default: data || data?.default ? data?.default : '',
    },
  });

  async function onSubmit(values: ContactFormValues) {
    const userId = getUserId();

    const createContactURL =
      LOCAL_BASE_URL + LOCAL_USERS_CONTROLLER + '/contact';

    const requestModel: any = {
      id: userId as string,
      default: values.default,
      title: values.title,
      number: values.number,
    };

    const response = await fetch(createContactURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestModel),
    });

    if (!response.ok) {
      // Handle error responses
      throw new Error('CREATE CONTACT FAILED');
    }

    const data: BaseResponse<BaseStatusResponse> = await response.json();

    if (data.data.isSuccess) {
      await refetch();
    }

    closeModal();
  }

  return (
    <div className="w-full md:w-[510px] mx-auto p-5 sm:p-8 bg-skin-fill rounded-md">
      <CloseButton onClick={closeModal} />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-6">
          <Input
            variant="solid"
            label="forms:label-contact-title"
            {...register('title', { required: 'Title Required' })}
            error={errors.title?.message}
          />
        </div>
        <div className="mb-6">
          <Input
            variant="solid"
            label="forms:label-contact-number"
            {...register('number', {
              required: 'forms:contact-number-required',
            })}
            error={errors.number?.message}
          />
        </div>
        <div className="mb-6">
          <input
            id="default-type"
            type="checkbox"
            className="form-checkbox w-5 h-5 border border-gray-300 rounded cursor-pointer transition duration-500 ease-in-out focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none   focus:checked:bg-skin-primary hover:checked:bg-skin-primary checked:bg-skin-primary"
            {...register('default', {
              required: 'forms:default-type-required',
            })}
          />
          <label
            htmlFor="default-type"
            className="align-middle ms-3 text-sm text-skin-muted"
          >
            {t('common:text-default-contact-number')}
          </label>
        </div>
        <Button className="h-11 md:h-12 w-full mt-1.5" type="submit">
          {t('common:text-save-number')}
        </Button>
      </form>
    </div>
  );
};

export default AddContactForm;
