import PasswordInput from '@components/ui/form/password-input';
import Button from '@components/ui/button';
import Heading from '@components/ui/heading';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

import {
  useChangePasswordMutation,
  ChangePasswordInputType,
} from '@framework/customer/use-change-password';

const defaultValues = {
  oldPassword: '************',
  newPassword: '',
  confirmPassword: '',
};

const ChangePassword: React.FC = () => {
  const { t } = useTranslation();
  const { mutate: changePassword, isLoading } = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordInputType>({
    defaultValues,
  });

  const watchNewPassword = watch('newPassword');
  const watchConfirmPassword = watch('confirmPassword');

  const validateConfirmPassword = (value: string) => {
    if (value !== watchNewPassword) {
      return 'New password and confirm password do not match';
    }
    return true;
  };

  function onSubmit(input: ChangePasswordInputType) {
    changePassword(input);
  }
  return (
    <>
      <Heading variant="titleLarge">
        {t('common:text-account-details-password')}
      </Heading>
      <div className="w-full flex  h-full lg:w-10/12 2xl:w-9/12 flex-col mt-6 lg:mt-7">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full mx-auto flex flex-col justify-center "
        >
          <div className="flex flex-col space-y-5 lg:space-y-7">
            <PasswordInput
              label={t('forms:label-old-password')}
              error={errors.oldPassword?.message}
              {...register('oldPassword', {
                required: `${t('forms:password-old-required')}`,
              })}
            />
            <PasswordInput
              label={t('forms:label-new-password')}
              error={errors.newPassword?.message}
              {...register('newPassword', {
                required: `${t('forms:password-new-required')}`,
              })}
            />

            <PasswordInput
              label={t('forms:label-new-password-confirm')}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: `${t('forms:password-new-confirm-required')}`,
                validate: validateConfirmPassword,
              })}
            />

            <div></div>

            <div className="relative mt-3">
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                variant="formButton"
                className="w-full sm:w-auto"
              >
                {t('common:text-change-password')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
