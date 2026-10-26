import Image from "next/image";

/** Displays the supplied artwork, framing out its transparent canvas in CSS. */
export default function Logo({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={`clinic-logo ${className}`}>
      <Image
        src="/images/clinic-logo-transparent.png"
        alt="Dr. Adam Dental Clinic"
        width={1895}
        height={830}
        sizes="(max-width: 600px) 160px, 220px"
        priority={priority}
      />
    </span>
  );
}

