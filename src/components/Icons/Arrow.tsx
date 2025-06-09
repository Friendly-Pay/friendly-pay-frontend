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
                opacity="0.3"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.30126 2.29289C5.70294 1.90237 6.3542 1.90237 6.75588 2.29289L11.8987 7.29289C12.3004 7.68342 12.3004 8.31658 11.8987 8.70711L6.75588 13.7071C6.3542 14.0976 5.70294 14.0976 5.30126 13.7071C4.89958 13.3166 4.89958 12.6834 5.30126 12.2929L9.71681 8L5.30126 3.70711C4.89958 3.31658 4.89958 2.68342 5.30126 2.29289Z"
                fill="currentColor"
            />
        </svg>
    );
};