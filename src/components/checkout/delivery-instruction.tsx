import TextArea from '@components/ui/form/text-area';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import Text from '@components/ui/text';
import { ChangeEvent } from 'react';

interface ContactFormValues {
  instructionNote: string;
  default: boolean;
}

const DeliveryInstructions: React.FC<{ data?: any }> = ({ data }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      instructionNote: data || '',
      default: data || false,
    },
  });

  function onSubmit(values: ContactFormValues) {
    console.log(values, 'Delivery Note');
  }

  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    localStorage.setItem('deliveryNotes', e.target.value);
  };

  return (
    <div className="w-full">
      <div className="w-full  mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-6">
            <TextArea
              variant="normal"
              inputClassName="focus:border-2 focus:outline-none focus:border-skin-primary"
              label="forms:label-delivery-instructions-note"
              {...register('instructionNote')}
              onChange={(e) => {
                handleOnChange(e);
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryInstructions;
