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
    <div
      style={{
        height: "400px",
        overflow: "hidden",
        borderRadius: "1rem",
        margin: "1rem",
        position: "relative",
        ...style,
      }}
    >
      <Image
        src={`https://image.tmdb.org/t/p/original${srcImg}`}
        alt={`${alt} backdrop`}
        style={{
          height: "100%",
          width: "100%",
          objectFit: "contain",
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
