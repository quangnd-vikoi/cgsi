import NextImage, { ImageProps } from "next/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Image({ src, ...props }: ImageProps) {
    const imageSrc = typeof src === "string" && src.startsWith("/")
        ? `${basePath}${src}`
        : src;

    return <NextImage src={imageSrc} {...props} />;
}
