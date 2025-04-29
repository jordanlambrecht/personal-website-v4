import { H2 } from '@typography'
import PhotoLink from '@/components/ui/PhotoLink'
import { BasicComponentProps } from '@/types'

const Distractions = ({ className }: BasicComponentProps) => {
  return (
    <div className={className}>
      <H2>Currently Distracting Myself With:</H2>
      {/* This uses columns for md+, ensuring items flow without strict row alignment */}
      <ul className={' list-none list-inside gap-y-4 columns-2 gap-x-8 space-y-4 text-sm'}>
        {/* break-inside-avoid prevents items splitting across columns */}
        <li className="w-full md:break-inside-avoid"> 🐳 Docker</li>
        <li className="w-full md:break-inside-avoid"> ⚛️ React + ▲ Next.js</li>
        <li className="w-full md:break-inside-avoid"> 🐍 Python</li>
        <li className="w-full md:break-inside-avoid"> ⚖️ Law & Order SVU </li>
        <li className="w-full md:break-inside-avoid"> 🌀 Doomscrolling NYT </li>
        <li className="w-full md:break-inside-avoid"> 🏡 Home Assistant</li>
        <li className="w-full md:break-inside-avoid">
          {' '}
          🛌 Forcing myself to make my bed every morning
        </li>
        <li className="w-full md:break-inside-avoid"> 🍥 3D printing & product design </li>
        <li className="w-full md:break-inside-avoid">
          {' '}
          🤖 AI Tinkering (Ollama, Local LLMs, and trying to understand the thousand abbreviations)
        </li>
        <li className="w-full md:break-inside-avoid"> 🐦 Bird watching</li>
        <li className="w-full md:break-inside-avoid"> 🧪 Homelabs </li>
        <li className="w-full md:break-inside-avoid"> 🪴 Keeping my houseplants alive </li>
        <li className="w-full md:break-inside-avoid">
          {' '}
          🐈{' '}
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
        </li>
        <li className="w-full md:break-inside-avoid"> 🔫 Call of Duty Warzone </li>
        <li className="w-full md:break-inside-avoid">💥 80&apos;s action movies</li>
      </ul>
    </div>
  )
}

export default Distractions
