// src/components/layout/Footer.tsx

import { InnerWrapper } from '@/components/layout'

export function Footer() {
  return (
    <InnerWrapper className="py-12 mt-24 mx-auto">
      <footer>
        <div className=" flex flex-col items-start justify-center gap-y-4">
          <p>Thanks for hangin&apos;</p>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </InnerWrapper>
  )
}
