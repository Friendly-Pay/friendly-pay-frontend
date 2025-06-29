import { SVGProps } from 'react';

export const ArrowRight = (props: SVGProps<SVGSVGElement>) => {
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