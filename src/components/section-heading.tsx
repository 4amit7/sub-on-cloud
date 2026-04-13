type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  theme?: "light" | "dark";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  theme = "light"
}: SectionHeadingProps) {
  const isDark = theme === "dark";

  return (
    <div className="max-w-3xl">
      <p
        className={`text-sm font-semibold uppercase tracking-[0.28em] ${
          isDark ? "text-[#FFC107]" : "text-[#E60000]"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 text-3xl font-bold md:text-4xl ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-4 text-base leading-7 md:text-lg ${
          isDark ? "text-white/72" : "text-black/65"
        }`}
      >
        {description}
      </p>
    </div>
  );
}
