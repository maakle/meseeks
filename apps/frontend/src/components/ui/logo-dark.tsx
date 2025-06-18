import Image from "next/image";

export const LogoDark = () => {
  return (
    <Image
      src="/assets/meseeks-logo-white.png"
      alt="Meseeks"
      width={40}
      height={40}
      priority
      loading="eager"
      className="mr-2"
    />
  );
};
