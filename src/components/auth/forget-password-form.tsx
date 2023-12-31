import Button from '@components/ui/button';
import Input from '@components/ui/form/input';
import Logo from '@components/ui/logo';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import {
  LOCAL_BASE_URL,
  LOCAL_USERS_CONTROLLER,
} from 'src/common/constants/api-constant';
import {
  BaseResponse,
  BaseStatusResponse,
} from 'src/common/models/auth-models';
import { useState } from 'react';

type FormValues = {
  email: string;
};

const defaultValues = {
  email: '',
};

const ForgetPasswordForm = () => {
  const { t } = useTranslation();
  const { closeModal, openModal } = useModalAction();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });
  const [isSuccess, setIsSuccess] = useState(false); // State to track the success status

  function handleSignIn() {
    return openModal('LOGIN_VIEW');
  }

  const onSubmit = async (values: FormValues) => {
    console.log(values, 'token');
    const loginURL =
      LOCAL_BASE_URL + LOCAL_USERS_CONTROLLER + '/forgot-password';

    const response = await fetch(loginURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      // Handle error responses
      throw new Error('Register failed');
    }

    const data: BaseResponse<BaseStatusResponse> = await response.json();

    const isSuccess = data.data.isSuccess;

    setIsSuccess(isSuccess); // Set the success status based on the API response
  };

  return (
    <div className="py-6 px-5 sm:p-8 bg-skin-fill mx-auto rounded-lg w-full sm:w-96 md:w-450px">
      <CloseButton onClick={closeModal} />
      <div className="text-center mb-9 pt-2.5">
        <div onClick={closeModal}>
          <Logo />
        </div>
        <p className="text-sm md:text-base text-body mt-3 sm:mt-4 mb-8 sm:mb-10">
          {t('common:forgot-password-helper')}
        </p>
      </div>
      {isSuccess ? ( // Check if isSuccess is true
        <p className="text-green-500 text-center">
          Password reset instructions sent successfully.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit((data) => onSubmit(data))}
          className="flex flex-col justify-center"
          noValidate
        >
          <Input
            label={t('forms:label-email')}
            type="email"
            variant="solid"
            className="mb-4"
            {...register('email', {
              required: `${t('forms:email-required')}`,
              pattern: {
                value:
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: t('forms:email-error'),
              },
            })}
            error={errors.email?.message}
          />

          <Button
            type="submit"
            variant="formButton"
            className="h-11 md:h-12 w-full mt-0"
          >
            {t('common:text-reset-password')}
          </Button>
        </form>
      )}

      <div className="flex flex-col items-center justify-center relative text-sm text-heading mt-8 sm:mt-10 mb-6 sm:mb-7">
        <hr className="w-full border-gray-300" />
        <span className="absolute -top-2.5 px-2 bg-skin-fill">
          {t('common:text-or')}
        </span>
      </div>
      <div className="text-sm sm:text-15px text-skin-muted text-center">
        {t('common:text-back-to')}{' '}
        <button
          type="button"
          className="text-skin-base underline font-medium hover:no-underline focus:outline-none"
          onClick={handleSignIn}
        >
          {t('common:text-login')}
        </button>
      </div>
    </div>
  );
};

export default ForgetPasswordForm;
