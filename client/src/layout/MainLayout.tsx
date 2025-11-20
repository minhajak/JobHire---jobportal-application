import { Outlet } from "react-router-dom";
import { Menu } from "../components";

const MainLayout = () => {
  return (
    // outer uses min-h-screen, so children can grow past viewport if needed
    <div className="min-h-screen w-screen bg-[#FAFAFA] flex flex-col md:flex-row">
      {/* Menu can be static in flow or fixed (see notes below) */}
      <Menu />

      {/* Main column that grows and lets inner content scroll */}
      <main className="flex-1 flex flex-col items-center shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] ">
        {/* Header */}
        <header className="hidden  w-full md:py-4 md:flex flex-row justify-center items-center gap-2 ">
          <span className="text-[14px] font-[500]">For you</span>
          <div className="group inline-flex items-center justify-center rounded-full bg-white shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] size-6 transition-transform duration-150 hover:scale-110">
            <svg
              aria-label="More"
              role="img"
              viewBox="0 0 13 12"
              className="size-[12px] text-black transition-transform duration-200 group-hover:scale-105"
            >
              <title>More</title>
              <path
                d="m2.5 4.2 4 4 4-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </header>

        {/* Content card: allow it to grow and scroll when content overflows */}
        <section className="flex-1 w-full md:w-[600px] border border-border pb-15 md:pb-0 md:rounded-t-2xl bg-white overflow-y-auto">
          {/* padding wrapper so Outlet children don't touch edges */}
          <div className="bg-white">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainLayout;
