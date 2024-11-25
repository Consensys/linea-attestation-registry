export const Title = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-6 md:gap-0">
      <h1 className="text-2xl md:text-[2rem]/[2rem] font-semibold tracking-tighter text-text-primary dark:text-whiteDefault">
        {title}
      </h1>
    </div>
  );
};
