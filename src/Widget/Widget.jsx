import React, { useState, useRef, useEffect } from 'react';

import { FaHeart } from 'react-icons/fa';

import { ITEMS, SIZES } from '../utils/constants';

import './widget.scss';

const Widget = () => {
  const widgetRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [offset, setOffset] = useState(0);
  const [size, setSize] = useState('M');
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setIsCompact(entry.contentRect.width <= 960);
      }
    });
    if (widgetRef.current) resizeObserver.observe(widgetRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const nonFav = ITEMS.filter((item) => !favorites.has(item.id));
  const favList = ITEMS.filter((item) => favorites.has(item.id));
  const slots = 4 - favList.length;
  const cycle =
    nonFav.length > 0
      ? nonFav.slice(offset, offset + slots).length === slots
        ? nonFav.slice(offset, offset + slots)
        : [
            ...nonFav.slice(offset),
            ...nonFav.slice(0, slots - (nonFav.length - offset)),
          ]
      : [];
  const display = [...favList, ...cycle];

  const handleNext = () => {
    if (nonFav.length) setOffset((offset + slots) % nonFav.length);
  };

  const handleTryOn = () => {};

  return (
    <div
      ref={widgetRef}
      className={`widget${isCompact ? ' widget--compact' : ''}`}
    >
      <div className='widget__left'>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleUpload}
          hidden
        />
        <div
          className='widget__upload'
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadedImage ? (
            <img
              src={uploadedImage}
              alt='Preview'
              className='widget__preview-img'
            />
          ) : (
            <div className='widget__placeholder'>Upload Photo</div>
          )}
        </div>
        <div className='widget__size-selector'>
          <label className='widget__size-label'>Select size</label>
          <select
            className='widget__size-select'
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        className='widget__arrow'
        onClick={handleNext}
        aria-label='Next items'
      >
        ▶
      </button>
      <div className='widget__items'>
        {display.map((item) => (
          <div
            key={item.id}
            className='widget__item'
            title={favorites.has(item.id) ? 'Unfavorite' : 'Favorite'}
          >
            <FaHeart
              className={`widget__item-heart ${
                favorites.has(item.id) ? 'widget__item-heart--active' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(item.id);
              }}
            />

            <img src={item.image} alt={item.name} />
            <div className='widget__item-name'>{item.name}</div>
          </div>
        ))}
      </div>
      <div className='widget__result'>"RESULT"</div>
    </div>
  );
};

export default Widget;
