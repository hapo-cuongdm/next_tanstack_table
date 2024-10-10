import Image, { ImageLoader, ImageLoaderProps, ImageProps } from "next/image";

type CustomNextImageProps = ImageProps

export const CustomNextImage = (props: CustomNextImageProps) => {
  const contentfulImageLoader: ImageLoader = ({ src, width }: ImageLoaderProps) => {
    return `${src}?w=${width}`;
  };

  return <Image loader={contentfulImageLoader} {...props} alt="" />;
};
