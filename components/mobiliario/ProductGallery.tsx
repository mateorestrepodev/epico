import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-8 h-full">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 md:w-28 overflow-x-auto md:overflow-visible">
        {images.slice(1).map((img, idx) => (
          <div
            key={idx}
            className="relative w-24 h-32 md:w-full md:h-36 flex-shrink-0 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
          >
            <Image
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              fill
              className="object-cover bg-black/5"
            />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative w-full aspect-[4/5] md:flex-1 bg-black/5">
        <Image
          src={images[0]}
          alt="Imagen principal del producto"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
