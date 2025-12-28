import { BankCard } from './BankCard';
import { SliderPagination } from './SliderPagination';
import { isCardActivationInProgress, isCardDisabled } from '@/states/cards/helpers';
import { MyCard, useCardsStore } from '@/states/cards/store';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Swiper, SwiperClass, SwiperRef, SwiperSlide } from 'swiper/react';
import classNames from 'classnames';
import styles from './CardsSlider.module.scss';

type CardsSliderProps = {
    myCards: Record<number, MyCard>
    currentCardId: number
}

export function CardsSlider({ myCards, currentCardId }: CardsSliderProps) {
    const componentRef = useRef<HTMLDivElement>(null);

    const cardsIds = useCardsStore(state => state.myCardsIds!);
    const myCardsCount = useCardsStore(state => state.myCardsCount);

    const sliderRef = useRef<SwiperRef | null>(null);
    const [margin, setMargin] = useState(0);
    const [offsets, setOffsets] = useState({ offsetBefore: 0, offsetAfter: 0 });
    const [activeIndex, setActiveIndex] = useState(cardsIds.indexOf(currentCardId));

    const computeLayout = () => {
        if (!componentRef.current) {
            return;
        }

        const slides = componentRef.current.getElementsByClassName('swiper-slide');
        if (!slides.length || !sliderRef.current) {
            return;
        }

        const cardRect = slides[0].getBoundingClientRect();
        const cardWidth = cardRect.width;
        const screenWidth = window.innerWidth;

        const availableSpace = screenWidth - cardWidth;
        const nextVisibleCardWidth = 56;

        let margin = availableSpace / 2 - nextVisibleCardWidth;
        if (margin < 6) {
            margin = availableSpace / 2;
        }

        const offset = screenWidth / 2 - cardWidth / 2;

        setMargin(margin);
        setOffsets({ offsetBefore: offset, offsetAfter: offset });
    };

    const showPagination = myCardsCount > 1;

    const timerId = useRef(0);

    const clearTimer = useCallback(() => {
        if (timerId.current) {
            clearTimeout(timerId.current);
        }
    }, []);

    useLayoutEffect(() => {
        computeLayout();
        const frameId = requestAnimationFrame(() => {
            if (sliderRef.current?.swiper) {
                sliderRef.current.swiper.slideTo(activeIndex, 0, false);
            }
        });
        return () => {
            cancelAnimationFrame(frameId);
            clearTimer();
        };
    }, []);

    const handleSlideTransitionStart = () => {
        clearTimer();
        timerId.current = setTimeout(() => {
            window.Telegram.WebApp.HapticFeedback.selectionChanged();
        }, 200);
    };

    const handleSlideChange = (swiper: SwiperClass) => {
        setActiveIndex(swiper.activeIndex);
        useCardsStore.getState().setSelectedCardId(cardsIds[swiper.activeIndex]);
    };

    const handleCardChange = (index: number) => {
        const swiper = sliderRef.current?.swiper;
        if (!swiper || swiper.activeIndex === index) {
            return;
        }
        swiper.slideTo(index);
    };

    return (
        <div
            ref={componentRef}
            className={classNames(styles.root, showPagination && styles.hasPagination)}
        >
            <Swiper
                ref={sliderRef}
                speed={370}
                className={styles.swiper}
                slidesPerView='auto'
                spaceBetween={margin}
                slidesOffsetBefore={offsets.offsetBefore}
                slidesOffsetAfter={offsets.offsetAfter}
                onSlideChange={handleSlideChange}
                onSlideChangeTransitionStart={handleSlideTransitionStart}
                onResize={computeLayout}
                cssMode={false}
            >
                {cardsIds.map((card, index) => {
                    const cardData = myCards[card];
                    const isPending = isCardActivationInProgress(cardData.status);
                    return (
                        <SwiperSlide
                            key={card}
                            className={styles.slide}
                            onClick={() => handleCardChange(index)}
                        >
                            <BankCard
                                cardTypeId={cardData.typeId}
                                lastFourDigits={cardData.number}
                                paymentSystem={cardData.paymentSystem}
                                isPending={isPending}
                                isDisabled={isCardDisabled(cardData.status)}
                                className={classNames(styles.card, activeIndex === index && styles.activeCard, isPending && styles.pending)}
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