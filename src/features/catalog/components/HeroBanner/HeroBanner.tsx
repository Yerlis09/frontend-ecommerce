import React, { useState, useEffect } from 'react';
import { type HeroBannerProps } from '../../types/product.types';
import styles from './HeroBanner.module.css';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  highlight,
  ctaText,
  onCtaClick,
  imageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUCRZSCiQVoqnBn44yx0KZlLIBeopTYeX0Up7148pLX9B6IgA0d4ofYkezSphn97NhUpqemjwH8u-QLfWxF9odWHmX-aF7PFLyCnYx-S7-zYjBSTF4sOLOur8S3MsH8SdSRz_nyg6OOY1BNKLw6CQVq0AADAVU8p17Nm96pI-SDQvKrkTUpQrymOIC2gObiy_our7tsL65ciNW6zM5ae-dRjZdaiQTpqvvGrK8mpLe8gX7vDIcA4vvYV_8BJooLrDEFkv377CeEilY',
  endTime,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.textContent}>
          <div className={styles.flashBadge}>
            <span className={`material-symbols-outlined ${styles.flashIcon}`}>
              local_fire_department
            </span>
            Flash Sale Ends Soon!
          </div>

          <h1 className={styles.title}>
            {title} <br />
            <span className={styles.highlight}>{highlight}</span>
          </h1>

          <p className={styles.subtitle}>{subtitle}</p>

          <div className={styles.ctaContainer}>
            <button className={styles.ctaButton} onClick={onCtaClick}>
              {ctaText}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>

            {endTime && (
              <div className={styles.countdown}>
                <div className={styles.countdownItem}>
                  <span className={styles.countdownValue}>
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className={styles.countdownLabel}>Hrs</span>
                </div>
                <div className={styles.countdownItem}>
                  <span className={styles.countdownValue}>
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className={styles.countdownLabel}>Min</span>
                </div>
                <div className={styles.countdownItem}>
                  <span className={styles.countdownValue}>
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className={styles.countdownLabel}>Sec</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.imageContainer}>
          <div className={styles.backgroundShape1} />
          <div className={styles.backgroundShape2} />
          <img
            src={imageUrl}
            alt="High-end wireless headphones floating in air"
            className={styles.image}
          />
        </div>
      </div>
    </div>
  );
};