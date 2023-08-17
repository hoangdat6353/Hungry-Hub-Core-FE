import { NextSeo, NextSeoProps } from 'next-seo';

interface SeoProps extends NextSeoProps {
  path: string;
}

const Seo = ({ title, description, path }: SeoProps) => {
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        url: `https://hungryhub-tdtu.netlify.app/${path}`,
        title,
        description,
        images: [
          {
            url: '/assets/images/seo-image.png',
            width: 800,
            height: 600,
            alt: 'Og Image Alt',
          },
          {
            url: '/assets/images/seo-image.png',
            width: 900,
            height: 800,
            alt: 'Og Image Alt Second',
          },
        ],
      }}
    />
  );
};

export default Seo;
