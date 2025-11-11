import logo from 'assets/logo.png?inline';

type GptonLogoProps = {
    className?: string
}

export const GptonLogo = ({ className }: GptonLogoProps) => {
    return (
        <img
            src={logo}
            alt=''
            className={className}
        />
    );
};