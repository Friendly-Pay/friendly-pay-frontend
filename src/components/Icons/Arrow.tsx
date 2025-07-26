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
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M23.4131 12.031L13.7061 21.738L12.292 20.324L19.585 13.031H1.99902V11.031H19.585L12.292 3.73804L13.7061 2.32397L23.4131 12.031Z"
                fill="currentColor"
            />
        </svg>
    );
};