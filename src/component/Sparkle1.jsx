import  { useState, useCallback, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const DEFAULT_COLOR = 'hsl(50deg, 100%, 50%)';

// Fonction utilitaire pour générer un nombre aléatoire
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

// Fonction pour générer un sparkle
const generateSparkle = (color = DEFAULT_COLOR) => {
    return {
        id: String(random(10000, 99999)),
        createdAt: Date.now(),
        color,
        size: random(15, 20),
        style: {
            top: random(0, 100) + '%',
            left: random(0, 100) + '%',
        }
    };
};

// Hook personnalisé pour créer un intervalle aléatoire
const useRandomInterval = (callback, minDelay, maxDelay) => {
    const timeoutId = useRef(null);
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        let isEnabled = true;

        const tick = () => {
            const nextTickAt = random(minDelay, maxDelay);

            timeoutId.current = window.setTimeout(() => {
                if (isEnabled) {
                    savedCallback.current();
                    tick();
                }
            }, nextTickAt);
        };

        tick();

        return () => {
            isEnabled = false;
            window.clearTimeout(timeoutId.current);
        };
    }, [minDelay, maxDelay]);

    return useCallback(() => {
        window.clearTimeout(timeoutId.current);
    }, []);
};

const Sparkles = ({  children, ...delegated }) => {
    const [sparkles, setSparkles] = useState(() => {
        return Array.from({ length: 3 }, () => generateSparkle());
    });

    useRandomInterval(
        () => {
            const now = Date.now();
            const sparkle = generateSparkle();
            const nextSparkles = sparkles.filter(spark => {
                const delta = now - spark.createdAt;
                return delta < 750;
            });
            nextSparkles.push(sparkle);
            setSparkles(nextSparkles);
        },
        50,
        500
    );

    return (
        <Wrapper {...delegated}>
            {sparkles.map(sparkle => (
                <Sparkle
                    key={sparkle.id}
                    color={sparkle.color}
                    size={sparkle.size}
                    style={sparkle.style}
                />
            ))}
            <ChildWrapper>{children}</ChildWrapper>
        </Wrapper>
    );
};

const Sparkle = ({ size, color, style }) => {
    const path =
        'M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z';
    return (
        <SparkleWrapper style={style}>
            <SparkleSvg width={size} height={size} viewBox="0 0 68 68" fill="none">
                <path d={path} fill={color} />
            </SparkleSvg>
        </SparkleWrapper>
    );
};

const sparkleAnimation = keyframes`
    0% {
        transform: scale(0) rotate(0deg);
    }
    50% {
        transform: scale(1) rotate(90deg);
    }
    100% {
        transform: scale(0) rotate(180deg);
    }
`;
const SparkleWrapper = styled.span`
    position: absolute;
    display: block;
    @media (prefers-reduced-motion: no-preference) {
        animation: ${sparkleAnimation} 700ms forwards;
    }
`;



const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(180deg);
    }
`;

const SparkleSvg = styled.svg`
    display: block;
    @media (prefers-reduced-motion: no-preference) {
        animation: ${spin} 1000ms linear;
    }
`;

const ChildWrapper = styled.strong`
    position: relative;
    z-index: 1;
    font-weight: bold;
`;

const Wrapper = styled.span`
    position: relative;
    display: inline-block;
`;

export default Sparkles;