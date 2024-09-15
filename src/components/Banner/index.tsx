import { Image } from "@nextui-org/react";

type BannerProps = {
  srcImg: string;
  alt: string;
  style?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
};

export default function Banner({
  srcImg,
  alt,
  style,
  imageStyle,
}: BannerProps) {
  return (
    <div className="relative m-4 overflow-hidden rounded-2xl" style={style}>
      <Image
        className="object-cover w-full h-full"
        src={`https://image.tmdb.org/t/p/original${srcImg}`}
        alt={`${alt} backdrop`}
        style={{
          ...imageStyle,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, var(--nextui-colors-background), transparent)",
        }}
      />
    </div>
  );
}
