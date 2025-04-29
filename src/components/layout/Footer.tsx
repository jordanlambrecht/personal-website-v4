// src/components/layout/Footer.tsx

export function Footer() {
  return (
    <footer className="block w-full px-4 py-12 mt-24 ">
      <div className="container flex flex-col items-start justify-center gap-y-4">
        <p className="text-sm italic text-black">Thanks for hangin&apos;</p>
        <p className="text-sm text-black">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
