import Alert from '@/components/Alert.vue'
import ApiInline from '@/components/api/Inline.vue'
import ApiLinks from '@/components/api/Links.vue'
import ApiSection from '@/components/api/Section.vue'
import ApiTable from '@/components/api/Table.vue'
import AppBtn from '@/components/app/Btn.vue'
import AppCaption from '@/components/app/Caption.vue'
import AppDivider from '@/components/app/Divider.vue'
import AppHeading from '@/components/app/Heading.vue'
import AppHeadline from '@/components/app/Headline.vue'
import AppImg from '@/components/app/Img.vue'
import AppLink from '@/components/app/Link.vue'
import AppMarkdown from '@/components/app/Markdown.vue'
import AppMarkup from '@/components/app/Markup.vue'
import AppSheet from '@/components/app/Sheet.vue'
import AppTable from '@/components/app/Table.vue'
import AppTitle from '@/components/app/Title.vue'
import Backmatter from '@/components/Backmatter.vue'
import Carbon from '@/components/ads/Carbon.vue'
import Discovery from '@/components/ads/Discovery.vue'
import Entry from '@/components/ads/Entry.vue'
import Example from '@/components/examples/Example.vue'
import Inline from '@/components/ads/Inline.vue'
import PageComponent from '@/components/PageComponent.vue'
import Promoted from '@/components/ads/Promoted.vue'
import Random from '@/components/ads/Random.vue'
import Usage from '@/components/examples/Usage.vue'
import Vuetify from '@/components/ads/Vuetify.vue'

import type { GlobalComponentsPlugin } from '@/types'

export const useGlobalComponents: GlobalComponentsPlugin = ({ app }) => {
  app.component('AppBtn', AppBtn)
  app.component('AppCaption', AppCaption)
  app.component('AppDivider', AppDivider)
  app.component('AppHeading', AppHeading)
  app.component('AppHeadline', AppHeadline)
  app.component('AppLink', AppLink)
  app.component('AppMarkdown', AppMarkdown)
  app.component('AppMarkup', AppMarkup)
  app.component('AppSheet', AppSheet)
  app.component('AppTable', AppTable)
  app.component('AppTitle', AppTitle)

  // Used by markdown files
  app.component('Alert', Alert)
  app.component('ApiInline', ApiInline)
  app.component('ApiLinks', ApiLinks)
  app.component('ApiSection', ApiSection)
  app.component('ApiTable', ApiTable)
  app.component('AppImg', AppImg)
  app.component('Backmatter', Backmatter)
  app.component('Carbon', Carbon)
  app.component('Discovery', Discovery)
  app.component('Entry', Entry)
  app.component('Example', Example)
  app.component('Inline', Inline)
  app.component('PageComponent', PageComponent)
  app.component('Promoted', Promoted)
  app.component('Random', Random)
  app.component('Usage', Usage)
  app.component('Vuetify', Vuetify)
}