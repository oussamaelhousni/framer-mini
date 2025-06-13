import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <ul className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            <Link
              href="/animated-scrollbar"
              className="text-blue-500 underline"
            >
              Animated scrollbar
            </Link>
          </li>
          <li className="mb-2 tracking-[-.01em]">
            <Link href="/skew-on-scroll" className="text-blue-500 underline">
              Skew text on scroll
            </Link>
          </li>
          <li className="mb-2 tracking-[-.01em]">
            <Link href="/kanban-board" className="text-blue-500 underline">
              Kanban board With Dnd-Kit
            </Link>
          </li>
        </ul>
      </main>
    </div>
  );
}
