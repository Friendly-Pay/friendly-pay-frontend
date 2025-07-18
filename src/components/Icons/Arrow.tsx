import { SVGProps } from 'react';

export const ArrowRight = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.30126 2.29289C5.70294 1.90237 6.3542 1.90237 6.75588 2.29289L11.8987 7.29289C12.3004 7.68342 12.3004 8.31658 11.8987 8.70711L6.75588 13.7071C6.3542 14.0976 5.70294 14.0976 5.30126 13.7071C4.89958 13.3166 4.89958 12.6834 5.30126 12.2929L9.71681 8L5.30126 3.70711C4.89958 3.31658 4.89958 2.68342 5.30126 2.29289Z"
                fill="currentColor"
            />
        </svg>
    );
};

export const ArrowDown = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M13.7071 4.70165C14.0976 5.10333 14.0976 5.75459 13.7071 6.15627L8.70711 11.2991C8.31658 11.7008 7.68342 11.7008 7.29289 11.2991L2.2929 6.15627C1.9024 5.75459 1.9024 5.10333 2.2929 4.70165C2.6834 4.29997 3.3166 4.29997 3.7071 4.70165L8 9.1172L12.2929 4.70165C12.6834 4.29997 13.3166 4.29997 13.7071 4.70165Z"
                fill="currentColor"
            />
        </svg>
    );
};