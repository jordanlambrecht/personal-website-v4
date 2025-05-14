// src/components/home/Distractions.tsx

import { H2 } from '@typography'
import PhotoLink from '@/components/ui/PhotoLink'
import { BasicComponentProps } from '@/types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SiteDistraction as SiteDistractionType } from '@/payload-types'

const Distractions = async ({ className }: BasicComponentProps) => {
  const payload = await getPayload({ config: configPromise })
  let siteDistractionsData: SiteDistractionType | null = null

  try {
    siteDistractionsData = await payload.findGlobal({
      slug: 'siteDistractions',
    })
  } catch (error) {
    console.error('Error fetching site distractions:', error)
  }

  const distractionItems = siteDistractionsData?.distractionItems || []
  const activeDistractionItems = distractionItems.filter((item) => item.active)
  return (
    <div className={className}>
      <H2>Currently Distracting Myself With:</H2>
      <ul className={'list-none list-inside gap-y-4 columns-2 gap-x-8 space-y-4 text-sm'}>
        {activeDistractionItems.map((item, idx) => (
          <li
            key={item.id || idx}
            className=" max-w-sm break-inside-avoid flex items-start gap-x-2"
          >
            {item.icon && <span>{item.icon}</span>}
            <span>
              {item.text}
              {item.photoLinks && item.photoLinks.length > 0 && item.text ? ' ' : ''}
              {item.photoLinks &&
                item.photoLinks.map((pl, index) => (
                  <span key={pl.id || index}>
                    <PhotoLink
                      imagePath={`${pl.imageFilename}`}
                      caption={pl.caption}
                      className="underline transition-opacity duration-300 ease-in-out text-primary hover:opacity-50"
                    >
                      {pl.linkText}
                    </PhotoLink>
                    {index < item.photoLinks!.length - 1 ? ' and ' : ''}
                  </span>
                ))}
            </span>
          </li>
        ))}
        {distractionItems.length === 0 && (
          <li className="w-full md:break-inside-avoid">Nothing distracting me right now! Wow!</li>
        )}
      </ul>
    </div>
  )
}

export default Distractions
