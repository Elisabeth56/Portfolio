type Props = {
  id: string;
  title: string;
  lede?: string;
};

/** A chapter heading on the desk's document: title left, one framing sentence right. */
export function SectionHead({ id, title, lede }: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
      <h2
        id={id}
        className="text-[2.25rem] leading-[1.04] font-medium tracking-[-0.035em] text-balance lg:max-w-[38.75rem] lg:text-[3.5rem] lg:leading-[1.02]"
      >
        {title}
      </h2>
      {lede && (
        <p className="text-base leading-normal text-pretty text-ink-2 lg:w-[28.75rem] lg:shrink-0">
          {lede}
        </p>
      )}
    </div>
  );
}
