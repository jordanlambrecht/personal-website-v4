import { H2 } from '@typography'
import PhotoLink from '@/components/ui/PhotoLink'
import { BasicComponentProps } from '@/types'

const Distractions = ({ className }: BasicComponentProps) => {
  return (
    <div className={className}>
      <H2>Currently Distracting Myself With:</H2>
      <ul className={' list-none list-inside gap-y-4 columns-2 gap-x-8 space-y-4 text-sm'}>
        <li className="w-full md:break-inside-avoid flex items-start gap-x-2">
          <span>🐳</span> <span>Docker</span>
        </li>
        <li className="w-full md:break-inside-avoid flex items-start gap-x-2">
          <span>⚛️</span> <span>React + ▲ Next.js</span>
        </li>
        <li className="w-full md:break-inside-avoid flex items-start gap-x-2">
          <span>🐍</span> <span>Python</span>
        </li>
        <li className="w-full md:break-inside-avoid flex items-start gap-x-2">
          <span>⚖️</span> <span>Law & Order SVU</span>
        </li>
        <li className="w-full md:break-inside-avoid flex items-start gap-x-2">
          <span>🌀</span> <span>Doomscrolling NYT</span>
        </li>
        <li className="w-full md:break-inside-avoid flex items-start gap-x-2">
          <span>🏡</span> <span>Home Assistant</span>
        </li>
        <li className="w-full md:break-inside-avoid flex items-start gap-x-2">
          <span>🛌</span> <span>Forcing myself to make my bed every morning</span>
        </li>
        <li className="w-full md:break-inside-avoid flex items-start gap-x-2">
          <span>🍥</span> <span>3D printing & product design</span>
        </li>
        <li className="w-full md:break-inside-avoid flex items-start gap-x-2">
          <span>🤖</span>
          <span>
            AI Tinkering (Ollama, Local LLMs, and trying to understand the thousand abbreviations)
          </span>
        </li>
        <li className="w-full md:break-inside-avoid flex items-start gap-x-2">
          <span>🐦</span> <span>Bird watching</span>
        </li>
        <li className="w-full md:break-inside-avoid flex items-start gap-x-2">
          <span>🧪</span> <span>Homelabs</span>
        </li>
        <li className="w-full md:break-inside-avoid flex items-start gap-x-2">
          <span>🪴</span> <span>Keeping my houseplants alive</span>
        </li>
        <li className="w-full md:break-inside-avoid flex items-start gap-x-2">
          <span>🐈</span>
          <span>
            <PhotoLink
              imagePath="jeremy-the-kid.jpg"
              caption="The fluffy boy, Jeremy."
              className="underline transition-opacity duration-300 ease-in-out text-primary hover:opacity-50"
            >
              Jeremy the Kid
            </PhotoLink>{' '}
            and{' '}
            <PhotoLink
              imagePath="sherrif-pickles.jpg"
              caption="Sheriff Pickles, law man."
              className="underline transition-opacity duration-300 ease-in-out text-primary"
            >
              Sheriff Pickles
            </PhotoLink>
          </span>
        </li>
        <li className="w-full md:break-inside-avoid flex items-start gap-x-2">
          <span>🔫</span> <span>Call of Duty Warzone</span>
        </li>
        <li className="w-full md:break-inside-avoid flex items-start gap-x-2">
          <span>💥</span> <span>80&apos;s action movies</span>
        </li>
      </ul>
    </div>
  )
}

export default Distractions
