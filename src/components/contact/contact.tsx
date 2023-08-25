import { useContactQuery } from '@framework/contact/contact';
import ContactBox from './contact-content';

const ContactPage: React.FC = () => {
  const { data, isLoading, isError } = useContactQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div className="w-full max-w-[1300px] mx-auto">
      <div className="flex flex-wrap">
        <div className="w-full">
          <ContactBox items={{ data: data }} />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
