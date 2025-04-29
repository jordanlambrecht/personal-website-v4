import { H2 } from '@typography'
import { InlineExternalLink } from '@/components/ui'
import { BasicComponentProps } from '@/types'

const ComeFindMe = ({ className }: BasicComponentProps) => {
  return (
    <div className={className}>
      <H2>Come Find Me:</H2>
      <ul className="grid w-auto  gap-x-1 gap-y-2 sm:grid-cols-2">
        <li className="w-fit">
          <InlineExternalLink href={'https://linkedin.com/in/jordan-lambrecht'} text={'LinkedIn'} />
        </li>
        <li>
          <InlineExternalLink href={'https://github.com/jordanlambrecht'} text="Github" />
        </li>
        <li>
          <InlineExternalLink href={'https://makerworld.com/en/@jordyjordy'} text="MakerWorld" />
        </li>
        <li>
          <InlineExternalLink href={'https://instagram.com/jordanlambrecht'} text="Instagram" />
        </li>
        <li>
          <InlineExternalLink href={'https://pixelbakery.com'} text="Pixel Bakery" rel="" />
        </li>
      </ul>
    </div>
  )
}

export default ComeFindMe
