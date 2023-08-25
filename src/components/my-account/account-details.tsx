import Input from '@components/ui/form/input';
import PasswordInput from '@components/ui/form/password-input';
import Button from '@components/ui/button';
import Heading from '@components/ui/heading';
import { useForm, Controller } from 'react-hook-form';
import {
  useUpdateUserMutation,
  UpdateUserType,
} from '@framework/customer/use-update-customer';
import { useTranslation } from 'next-i18next';
import Switch from '@components/ui/switch';
import Text from '@components/ui/text';
import { useEffect } from 'react';
import axios from 'axios';
import { User } from 'src/common/models/user.models';
import {
  LOCAL_BASE_URL,
  LOCAL_USERS_CONTROLLER,
} from 'src/common/constants/api-constant';
import { decodeToken, getToken } from '@framework/utils/get-token';

const defaultValues = {};

const AccountDetails: React.FC = () => {
  const { mutate: updateUser, isLoading } = useUpdateUserMutation();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<UpdateUserType>({
    defaultValues,
  });

  function onSubmit(input: UpdateUserType) {
    updateUser(input);
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userToken = getToken();
        if (userToken != null) {
          const decodedToken = decodeToken(userToken);
          const userId = decodedToken?.id;

          const response = await axios.get(
            LOCAL_BASE_URL + LOCAL_USERS_CONTROLLER + '/' + userId
          ); // Replace with your API endpoint
          const userDetails: User = response.data;

          setValue('firstName', userDetails.firstName || '');
          setValue('address', userDetails.address || '');
          setValue('phoneNumber', userDetails.phone || '');
          setValue('lastName', userDetails.lastName || '');
          setValue('email', userDetails.email);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="w-full flex flex-col">
      <Heading variant="titleLarge" className="mb-5 md:mb-6 lg:mb-7 lg:-mt-1">
        {t('common:text-account-details-personal')}
      </Heading>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto flex flex-col justify-center"
        noValidate
      >
        <div className="border-skin-base border-b pb-7 md:pb-8 lg:pb-10">
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <Input
                label={t('forms:label-first-name')}
                {...register('firstName', {
                  required: 'forms:first-name-required',
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.firstName?.message}
              />
              <Input
                label={t('forms:label-last-name')}
                {...register('lastName', {
                  required: 'forms:last-name-required',
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.lastName?.message}
              />
            </div>
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <Input
                type="tel"
                label={t('forms:label-phone')}
                {...register('phoneNumber', {
                  required: 'forms:phone-required',
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.phoneNumber?.message}
              />
              <Input
                label={t('forms:label-address')}
                {...register('address', {
                  required: 'forms:address-required',
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.address?.message}
              />
            </div>
          </div>
        </div>
        <Heading
          variant="titleLarge"
          className="mb-5 xl:mb-8 pt-6 md:pt-7 lg:pt-8"
        >
          {t('common:text-account-details-account')}
        </Heading>
        <div className="border-skin-base border-b pb-7 md:pb-9 lg:pb-10">
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <Input
                type="email"
                label={t('forms:label-email-star')}
                {...register('email', {
                  required: 'forms:email-required',
                  pattern: {
                    value:
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'forms:email-error',
                  },
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.email?.message}
                disabled={true}
              />
            </div>
          </div>
        </div>

        <div className="relative flex sm:ms-auto mt-5 pb-2 lg:pb-0">
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            variant="formButton"
            className="w-full sm:w-auto"
          >
            {t('common:button-save-changes')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;
