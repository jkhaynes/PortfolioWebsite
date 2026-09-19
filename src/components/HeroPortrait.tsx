import Image from "next/image";

export default function HeroPortrait() {
  return (
    <div className="hero-portrait">
      <Image
        unoptimized
        src="/images/jessica-haynes-portrait.webp"
        alt="Portrait of Jessica Haynes"
        width={480}
        height={480}
      />
    </div>
  );
}
