import Edu from "/Illustrations/Edu.png";

const QuoteSection = () => {
  return (
    <div className="bg-[#EE86A7FF] flex flex-col space-y-6 items-center justify-center">
      <img className="w-[470px] h-[416px]" src={Edu} alt="Education" />
      <div className="flex flex-col space-y-1">
        <h1 className="font-bold text-xl text-white">
          The great aim of education is not knowledge but action
        </h1>
        <p className="text-sm text-white text-center font-medium">
          Herbert Spencer
        </p>
      </div>
    </div>
  );
};

export default QuoteSection;
