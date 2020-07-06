/**
 * Insert common items here
 */
import toscalogoColor from 'Assets/toscalogo_color.svg'
import toscalogoGrayscale from 'Assets/toscalogo_grayscale.svg'

export const images = {
  toska_color: toscalogoColor,
  toska_grayscale: toscalogoGrayscale,
}

export const colors = {

}

export const basePath = process.env.BASE_PATH || '/'

export const builtAt = process.env.BUILT_AT || '0'

export const sentryIdentifier = process.env.SENTRY_IDENTIFIER || undefined

export * from 'Root/util/common'
