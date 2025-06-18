import Image from "next/image";

export const LogoLight = () => {
  return (
    <Image
      src="/assets/meseeks-logo-black.png"
      alt="Meseeks"
      width={40}
      height={40}
      priority
      loading="eager"
      className="mr-2"
    />
  );
};
