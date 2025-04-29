// /src/types/index.ts

import {
  Media as MediaType,
  OtherProject as OtherProjectType,
  ProductDesign as ProductDesignType,
} from '../payload-types'

export type Project = {
  id: string
  title: string
  description?: string
  image?: MediaType
  link?: string
  projectType?: string
  date?: string
  tags?: { tag: string }[]
}

export type ProductDesign = ProductDesignType
export type OtherProject = OtherProjectType

import { SVGProps } from 'react'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
  filled?: boolean
}

export type BasicComponentProps = {
  children?: React.ReactNode
  className?: string
}
