import { H1, P } from '@typography'
import Link from 'next/link'

const IntroText = () => {
  return (
    <>
      <H1>Hi There,</H1>

      <P className="w-full md:text-balance">
        I&apos;m Jordan Lambrecht, a Professional Something or Another based out of Lincoln,
        Nebraska.
      </P>

      <P className="w-full md:text-balance">
        Creating well-designed and personal moments that make people happy gets me out of bed in the
        morning - and keeps me up at night. As such, an off button is not part of my programming, be
        it with <Link href={'https://pixelbakery.com/work'}>animation</Link>,{' '}
        <Link href="https://github.com/jordanlambrecht"> web development</Link>, or any other outlet
        that involves making something exist that didn&apos;t before. When I&apos;m not staring at a
        computer, I&apos;m probably building something, killing plants, or being{' '}
        <Link href="https://instagram.com/shitty_pots"> terrible at ceramics</Link>.
      </P>

      <P className="w-full md:text-balance">
        I&apos;m the Director and Founder of{' '}
        <Link href={'https://pixelbakery.com'}>Pixel Bakery Design Studio</Link> and sit on the
        Board of Directors for the{' '}
        <Link href={'https://luxcenter.org'}> Lux Center for the Arts</Link>. Sometimes I host
        workshops, create <Link href={'https://pixelbakery.com/education'}>tutorials</Link>, and do
        some public speaking.
      </P>

      <P className="w-full md:text-balance">
        I believe the critical components of a greater creative community are vulnerability,
        de-stigmatization of mental health, and paths of equity.
      </P>
      <P className="w-full md:text-balance">
        I believe in free and open education, treating human beings like humans, and empowering
        those not as far along on their journey as I am.
      </P>
      <P>I believe in you. ❤️</P>
    </>
  )
}

export default IntroText
