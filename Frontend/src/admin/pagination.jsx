import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const Paginations = ({ totalChambres, ChambrePage, paginate }) => {
  const [currentPaege, setCurrentPage] = useState(1);
  const TotalPage = Math.ceil(totalChambres / ChambrePage);
  const PageNumber = [];
  for (let index = 0; index < TotalPage; index++) {
    PageNumber.push(index + 1);
  }

  const HandelAvant = () => {
    if (currentPaege >= 1) {
      setCurrentPage(currentPaege - 1);
      paginate(currentPaege - 1);
    }
  };
  const Handelarrier = () => {
    if (currentPaege <= TotalPage) {
      setCurrentPage(currentPaege + 1);
      paginate(currentPaege + 1);
    }
  };
  const HandelClick = (number) => {
    setCurrentPage(number);
    paginate(number);
  };

  return (
    <>
      <nav>
        <ul className="flex flex-row gap-5 items-center">
          <button
            onClick={HandelAvant}
            className={`flex gap-2 text-base font-normal px-3 py-2 border border-stone-400 rounded-lg ${currentPaege === 1 ? `opacity-50 cursor-not-allowed` : `cursor-pointer`}`}
            disabled={currentPaege === 1}
          >
            <ChevronLeft /> prev
          </button>

          {PageNumber.map((number) => (
            <li key={number}>
              <button
                onClick={() => HandelClick(number)}
                className={`px-3 py-2 border-solid rounded-lg font-semibold 
                    ${currentPaege === number ? "text-white bg-yellow-700 border-yellow-700" : "text-neutral-500 bg-stone-50 border-stone-400"}`}
              >
                {number}
              </button>
            </li>
          ))}

          <button
            onClick={Handelarrier}
            className={`flex gap-2 text-base font-normal px-3 py-2 border border-stone-400 rounded-lg ${currentPaege === TotalPage ? `opacity-50 cursor-not-allowed` : `cursor-pointer`}`}
            disabled={currentPaege === TotalPage}
          >
            next <ChevronRight />
          </button>
        </ul>
      </nav>
    </>
  );
};

export default Paginations;
