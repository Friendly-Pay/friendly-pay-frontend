import 'swiper/css';
import { BankCard } from './BankCard';
import { SliderPagination } from './SliderPagination';
import { MyCard, useCardsStore } from '@/states/cards/store';
import { useLayoutEffect, useRef, useState } from 'react';
import { Swiper, SwiperClass, SwiperRef, SwiperSlide } from 'swiper/react';
import classNames from 'classnames';
import styles from './CardsSlider.module.scss';

type CardsSliderProps = {
    myCards: Record<number, MyCard>
    currentCardId: number
}

export function CardsSlider({ myCards, currentCardId }: CardsSliderProps) {
    const cardsIds = useCardsStore(state => state.myCardsIds!);
    const myCardsCount = useCardsStore(state => state.myCardsCount);
    const openCardDetails = useCardsStore(state => state.openCardDetails);

    const sliderRef = useRef<SwiperRef | null>(null);
    const [margin, setMargin] = useState(0);
    const [offsets, setOffsets] = useState({ offsetBefore: 0, offsetAfter: 0 });
    const [activeIndex, setActiveIndex] = useState(cardsIds.indexOf(currentCardId));

    const computeLayout = () => {
        const slides = document.getElementsByClassName('swiper-slide');
        if (!slides.length || !sliderRef.current) {
            return;
        }

        const cardRect = slides[0].getBoundingClientRect();
        const cardWidth = cardRect.width;

        const availableSpace = window.innerWidth - cardWidth;
        const nonActiveCardVisibleWidth = 50;

        let margin = availableSpace / 2 - nonActiveCardVisibleWidth;
        if (margin < 16) {
            margin = availableSpace / 2;
        }

        const offset = window.innerWidth / 2 - cardWidth / 2;

        setMargin(margin);
        setOffsets({ offsetBefore: offset, offsetAfter: offset });
    };

    const showPagination = myCardsCount > 1;
    useLayoutEffect(() => {
        computeLayout();
    }, []);

    const setSelectedCardId = useCardsStore(state => state.setSelectedCardId);
    const handleSlideChange = (swiper: SwiperClass) => {
        setActiveIndex(swiper.activeIndex);
        setSelectedCardId(cardsIds[swiper.activeIndex]);
        window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
    };

    const handleCardChange = (index: number) => {
        if (sliderRef.current && sliderRef.current.swiper) {
            sliderRef.current.swiper.slideTo(index);
        }
    };

    return (
        <div className={classNames(styles.root, showPagination && styles.hasPagination)}>
            <Swiper
                ref={sliderRef}
                speed={500}
                className={styles.swiper}
                slidesPerView='auto'
                spaceBetween={margin}
                slidesOffsetBefore={offsets.offsetBefore}
                slidesOffsetAfter={offsets.offsetAfter}
                onSlideChange={handleSlideChange}
                onResize={computeLayout}
            >
                {cardsIds.map((card, index) => {
                    const cardData = myCards[card];
                    return (
                        <SwiperSlide
                            key={card}
                            className={styles.slide}
                            onClick={() => handleCardChange(index)}
                        >
                            <BankCard
                                typeId={cardData.typeId}
                                lastFourDigits={cardData.number}
                                paymentSystem={cardData.paymentSystem}
                                status={cardData.status}
                                active={index === activeIndex}
                                virtual={cardData.isVirtual}
                                className={classNames(styles.card, activeIndex === index && styles.activeCard)}
                                onClickDigits={openCardDetails}
                            />
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {showPagination && <SliderPagination
                total={cardsIds.length}
                activeIndex={activeIndex}
                className={styles.pagination}
                onClick={handleCardChange}
            />}
        </div>
    );
}