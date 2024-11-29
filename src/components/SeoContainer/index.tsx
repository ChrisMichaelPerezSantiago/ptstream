import { Helmet } from "react-helmet";

type SEOProps = {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
};

const SeoContainer = ({
  title,
  description,
  keywords,
  canonical,
}: SEOProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
};

export default SeoContainer;
