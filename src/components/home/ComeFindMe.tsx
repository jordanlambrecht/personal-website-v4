// src/components/home/ComeFindMe.tsx
import { H2 } from '@typography'
import { InlineExternalLink } from '@/components/ui'
import { BasicComponentProps } from '@/types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SiteSocialLink as SiteSocialLinkType } from '@/payload-types'

// Define a more specific type for the items within the socialLinks array
type SocialLinkItem = SiteSocialLinkType['socialLinks'][number]

const ComeFindMe = async ({ className }: BasicComponentProps) => {
  const payload = await getPayload({ config: configPromise })
  let socialLinks: SocialLinkItem[] = []

  try {
    const siteSocialLinksData = await payload.findGlobal({
      slug: 'siteSocialLinks',
    })
    // Filter for active links and ensure socialLinks array exists
    if (siteSocialLinksData && siteSocialLinksData.socialLinks) {
      socialLinks = siteSocialLinksData.socialLinks.filter(
        (link) => link.active !== false,
      ) as SocialLinkItem[]
    }
  } catch (error) {
    console.error('Error fetching site social links:', error)
  }

  return (
    <div className={className}>
      <H2>Come Find Me:</H2>
      {socialLinks.length > 0 ? (
        <ul className="grid w-auto gap-x-3 md:gap-x-1 gap-y-2 grid-cols-2">
          {socialLinks.map((link) => (
            <li key={link.id || link.title}>
              {' '}
              {/* Use link.id if available from Payload array items, else title */}
              <InlineExternalLink
                href={link.url || ''}
                text={link.title || 'Link'}
                target={link.targetBlank !== false ? '_blank' : undefined}
                rel={link.targetBlank !== false ? 'noopener noreferrer' : undefined}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>No social links available at the moment.</p>
      )}
    </div>
  )
}

export default ComeFindMe
