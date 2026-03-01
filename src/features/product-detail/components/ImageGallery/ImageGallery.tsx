import React, { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <img
        src={images[selected]}
        alt={alt}
        style={{ width: '100%', borderRadius: '16px', objectFit: 'cover' }}
      />
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${alt} ${i + 1}`}
              onClick={() => setSelected(i)}
              style={{
                width: '72px',
                height: '72px',
                objectFit: 'cover',
                borderRadius: '8px',
                cursor: 'pointer',
                border: i === selected ? '2px solid var(--primary, #6c3ce1)' : '2px solid transparent',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
