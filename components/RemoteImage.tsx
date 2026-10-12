import Image from "next/image";

type RemoteImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
};

export default function RemoteImage({
  src,
  alt,
  className,
  sizes,
  priority,
  fill,
  width = 1600,
  height = 1000
}: RemoteImageProps) {
  if (src.toLowerCase().includes(".svg")) {
    return (
      // Remote sponsor marks include SVG files, which the image optimizer will not pass through.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={encodeURI(src)} alt={alt} className={fill ? `absolute inset-0 h-full w-full ${className ?? ""}` : className} />
    );
  }

  if (fill) {
    return <Image src={src} alt={alt} fill className={className} sizes={sizes ?? "100vw"} priority={priority} />;
  }

  return <Image src={src} alt={alt} width={width} height={height} className={className} sizes={sizes} priority={priority} />;
}
