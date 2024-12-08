import { Image, Space } from 'antd';
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';

import styled from '@emotion/styled';
import useEmblaCarousel from 'embla-carousel-react';

const mock = [
  {
    id: 1,
    source:
      'https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2021-12/img_1570.jpg',
  },
  {
    id: 2,
    source:
      'https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2021-12/img_2833_-_copy_0.jpg',
  },
  {
    id: 3,
    source:
      'https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2021-12/img_7639_0.jpg',
  },
  {
    id: 4,
    source:
      'https://cdn2.psychologytoday.com/assets/styles/article_inline_half_caption/public/field_blog_entry_images/2024-10/pexels-steshkawillems-1390361.jpg',
  },
  {
    id: 5,
    source:
      'https://cdn2.psychologytoday.com/assets/styles/article_inline_half_caption/public/field_blog_entry_images/2024-02/cat%20dog%20dead%20body%20cropped.jpg',
  },
];

export function LostFoundImageItems() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel();
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on('select', onSelect).on('reInit', onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    <EmblaImageComponent>
      <Space direction="vertical" size={10}>
        <div style={{ position: 'relative' }}>
          <div className="navigate navigate-left" onClick={() => onThumbClick(selectedIndex - 1)}>
            <LeftCircleFilled style={{ fontSize: 28, color: '#ccc' }} />
          </div>

          <div className="navigate navigate-right" onClick={() => onThumbClick(selectedIndex + 1)}>
            <RightCircleFilled style={{ fontSize: 28, color: '#ccc' }} />
          </div>

          <div ref={emblaMainRef} style={{ overflow: 'hidden' }}>
            <div className="embla-container">
              {mock.map((ss, index) => (
                <div className="embla-slide" key={index}>
                  <div className="embla-slide-card">
                    <Image src={ss.source} alt="edc" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="embla-thumbs">
          <div ref={emblaThumbsRef} style={{ overflow: 'hidden' }}>
            <div className="embla-thumbs-container">
              {mock.map((ss, index) => (
                <div
                  key={index}
                  className="embla-thumbs-slide"
                  onClick={() => onThumbClick(index)}
                  style={index === selectedIndex ? { opacity: 0.8, border: '5px solid #ff0000' } : { opacity: 1 }}
                >
                  <img src={ss.source} alt="edc" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Space>
    </EmblaImageComponent>
  );
}

const EmblaImageComponent = styled.div({
  maxWidth: '48rem',
  margin: 'auto',
  '.embla-container': {
    display: 'flex',
    touchAction: 'pan-y pinch-zoom',
    marginLeft: 'calc(1rem * -1)',
  },
  '.embla-slide': {
    transform: 'translate3d(0, 0, 0)',
    flex: '0 0 100%',
    minWidth: 0,
    paddingLeft: '1rem',
  },
  '.embla-slide-card': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '19rem',
    userSelect: 'none',
    border: '1px solid #000',
    borderRadius: '5px',
    overflow: 'hidden',
    background: '#1c2536',
  },
  '.embla-thumbs-container': {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'calc(0.8rem * -1)',
  },
  '.embla-thumbs-slide': {
    flex: '0 0 25%',
    minWidth: 0,
    appearance: 'none',
    backgroundColor: 'transparent',
    touchAction: 'manipulation',
    overflow: 'hidden',
    height: '100px',
    background: '#1c2536',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #000',
  },
  '.navigate': {
    position: 'absolute',
    zIndex: 10,
    cursor: 'pointer',
    transition: '0.5s all ease',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    '.anticon': {
      opacity: 0.7,
    },
    '&.navigate-left': {
      left: 0,
    },
    '&.navigate-right': {
      right: 0,
    },
    ':hover': {
      background: 'rgba(0, 0, 0, 0.3)',
    },
  },
});
