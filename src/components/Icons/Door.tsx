import { SVGProps } from 'react';

export const DoorOpened = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M7 11C7 9.89543 7.89543 9 9 9H15V35H9C7.89543 35 7 34.1046 7 33V11Z"
                fill="currentColor"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18 6.60637C18 5.29131 19.2473 4.33437 20.5176 4.67473L35.1777 8.60246C36.052 8.83671 36.66 9.62906 36.6602 10.5341V33.9648C36.6602 34.87 36.0521 35.6631 35.1777 35.8974L20.5176 39.8251C19.2474 40.1655 18.0001 39.2085 18 37.8935V6.60637ZM24 19.9999C22.8954 19.9999 22 20.8954 22 21.9999C22 23.1045 22.8955 23.9999 24 23.9999C25.1045 23.9999 26 23.1045 26 21.9999C26 20.8954 25.1046 19.9999 24 19.9999Z"
                fill="currentColor"
            />
        </svg>
    );
};