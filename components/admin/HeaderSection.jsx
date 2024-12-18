const HeaderSection = ({ title, description, subtitle }) => {
  return (
    <div className="border-b flex items-center px-2 h-20 pb-2">
      <div className="p-6">
        <p className="text-xl font-semibold my-2 underline decoration-sky-500 hover:decoration-4">
          {title}
        </p>
        <p className="text-md">{subtitle}</p>
      </div>
      <div className="p-6">
        <p className="mt-4">{description}</p>
      </div>
    </div>
  );
};

export default HeaderSection;
