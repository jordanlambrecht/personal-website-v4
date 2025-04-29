/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = async (props: Args): Promise<Metadata> => {
  return generatePageMetadata({ config, params: props.params, searchParams: props.searchParams })
}

const Page = async (props: Args) => {
  return RootPage({ config, params: props.params, searchParams: props.searchParams, importMap })
}

export default Page
