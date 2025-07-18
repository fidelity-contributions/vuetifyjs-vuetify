// Styles
import './VFileUpload.sass'

// Components
import { VFileUploadItem } from './VFileUploadItem'
import { VBtn } from '@/components/VBtn/VBtn'
import { VDefaultsProvider } from '@/components/VDefaultsProvider/VDefaultsProvider'
import { makeVDividerProps, VDivider } from '@/components/VDivider/VDivider'
import { VIcon } from '@/components/VIcon/VIcon'
import { VOverlay } from '@/components/VOverlay/VOverlay'
import { makeVSheetProps, VSheet } from '@/components/VSheet/VSheet'

// Composables
import { makeDelayProps } from '@/composables/delay'
import { makeDensityProps, useDensity } from '@/composables/density'
import { useFileDrop } from '@/composables/fileDrop'
import { IconValue } from '@/composables/icons'
import { useLocale } from '@/composables/locale'
import { useProxiedModel } from '@/composables/proxiedModel'

// Utilities
import { ref, shallowRef } from 'vue'
import { filterInputAttrs, genericComponent, pick, propsFactory, useRender, wrapInArray } from '@/util'

// Types
import type { PropType, VNode } from 'vue'

export type VFileUploadSlots = {
  browse: {
    props: { onClick: (e: MouseEvent) => void }
  }
  default: never
  icon: never
  input: {
    inputNode: VNode
  }
  item: {
    file: File
    props: { 'onClick:remove': () => void }
  }
  title: never
  divider: never
}

export const makeVFileUploadProps = propsFactory({
  browseText: {
    type: String,
    default: '$vuetify.fileUpload.browse',
  },
  dividerText: {
    type: String,
    default: '$vuetify.fileUpload.divider',
  },
  title: {
    type: String,
    default: '$vuetify.fileUpload.title',
  },
  subtitle: String,
  icon: {
    type: IconValue,
    default: '$upload',
  },
  modelValue: {
    type: [Array, Object] as PropType<File[] | File>,
    default: null,
    validator: (val: any) => {
      return wrapInArray(val).every(v => v != null && typeof v === 'object')
    },
  },
  clearable: Boolean,
  disabled: Boolean,
  hideBrowse: Boolean,
  multiple: Boolean,
  scrim: {
    type: [Boolean, String],
    default: true,
  },
  showSize: Boolean,
  name: String,

  ...makeDelayProps(),
  ...makeDensityProps(),
  ...pick(makeVDividerProps({
    length: 150,
  }), ['length', 'thickness', 'opacity']),
  ...makeVSheetProps(),
}, 'VFileUpload')

export const VFileUpload = genericComponent<VFileUploadSlots>()({
  name: 'VFileUpload',

  inheritAttrs: false,

  props: makeVFileUploadProps(),

  emits: {
    'update:modelValue': (files: File[]) => true,
  },

  setup (props, { attrs, slots }) {
    const { t } = useLocale()
    const { densityClasses } = useDensity(props)
    const model = useProxiedModel(
      props,
      'modelValue',
      props.modelValue,
      val => wrapInArray(val),
      val => (props.multiple || Array.isArray(props.modelValue)) ? val : val[0],
    )

    const isDragging = shallowRef(false)
    const vSheetRef = ref<InstanceType<typeof VSheet> | null>(null)
    const inputRef = ref<HTMLInputElement | null>(null)
    const { handleDrop } = useFileDrop()

    function onDragover (e: DragEvent) {
      e.preventDefault()
      e.stopImmediatePropagation()
      isDragging.value = true
    }

    function onDragleave (e: DragEvent) {
      e.preventDefault()
      isDragging.value = false
    }

    async function onDrop (e: DragEvent) {
      e.preventDefault()
      e.stopImmediatePropagation()
      isDragging.value = false

      if (!inputRef.value) return

      const dataTransfer = new DataTransfer()
      for (const file of await handleDrop(e)) {
        dataTransfer.items.add(file)
      }

      inputRef.value.files = dataTransfer.files
      inputRef.value.dispatchEvent(new Event('change', { bubbles: true }))
    }

    function onClick () {
      inputRef.value?.click()
    }

    function onClickRemove (index: number) {
      const newValue = model.value.filter((_, i) => i !== index)
      model.value = newValue

      if (newValue.length > 0 || !inputRef.value) return

      inputRef.value.value = ''
    }

    useRender(() => {
      const hasTitle = !!(slots.title || props.title)
      const hasIcon = !!(slots.icon || props.icon)
      const hasBrowse = !!(!props.hideBrowse && (slots.browse || props.density === 'default'))
      const cardProps = VSheet.filterProps(props)
      const dividerProps = VDivider.filterProps(props)
      const [rootAttrs, inputAttrs] = filterInputAttrs(attrs)

      const inputNode = (
        <input
          ref={ inputRef }
          type="file"
          disabled={ props.disabled }
          multiple={ props.multiple }
          name={ props.name }
          onChange={ e => {
            if (!e.target) return

            const target = e.target as HTMLInputElement
            model.value = [...target.files ?? []]
          }}
          { ...inputAttrs }
        />
      )

      return (
        <>
          <VSheet
            ref={ vSheetRef }
            { ...cardProps }
            class={[
              'v-file-upload',
              {
                'v-file-upload--clickable': !hasBrowse,
                'v-file-upload--disabled': props.disabled,
                'v-file-upload--dragging': isDragging.value,
              },
              densityClasses.value,
              props.class,
            ]}
            style={[
              props.style,
            ]}
            onDragleave={ onDragleave }
            onDragover={ onDragover }
            onDrop={ onDrop }
            onClick={ !hasBrowse ? onClick : undefined }
            { ...rootAttrs }
          >
            { hasIcon && (
              <div key="icon" class="v-file-upload-icon">
                { !slots.icon ? (
                  <VIcon
                    key="icon-icon"
                    icon={ props.icon }
                  />
                ) : (
                  <VDefaultsProvider
                    key="icon-defaults"
                    defaults={{
                      VIcon: {
                        icon: props.icon,
                      },
                    }}
                  >
                    { slots.icon() }
                  </VDefaultsProvider>
                )}
              </div>
            )}

            { hasTitle && (
              <div key="title" class="v-file-upload-title">
                { slots.title?.() ?? t(props.title) }
              </div>
            )}

            { props.density === 'default' && (
              <>
                <div key="upload-divider" class="v-file-upload-divider">
                  { slots.divider?.() ?? (
                    <VDivider { ...dividerProps }>
                      { t(props.dividerText) }
                    </VDivider>
                  )}
                </div>

                { hasBrowse && (
                  <>
                    { !slots.browse ? (
                      <VBtn
                        readonly={ props.disabled }
                        size="large"
                        text={ t(props.browseText) }
                        variant="tonal"
                        onClick={ onClick }
                      />
                    ) : (
                      <VDefaultsProvider
                        defaults={{
                          VBtn: {
                            readonly: props.disabled,
                            size: 'large',
                            text: t(props.browseText),
                            variant: 'tonal',
                          },
                        }}
                      >
                        { slots.browse({ props: { onClick } }) }
                      </VDefaultsProvider>
                    )}
                  </>
                )}

                { props.subtitle && (
                  <div class="v-file-upload-subtitle">
                    { props.subtitle }
                  </div>
                )}
              </>
            )}

            <VOverlay
              modelValue={ isDragging.value }
              contained
              scrim={ props.scrim }
            />

            { slots.input?.({ inputNode }) ?? inputNode }
          </VSheet>

          { model.value.length > 0 && (
            <div class="v-file-upload-items">
              { model.value.map((file, i) => {
                const slotProps = {
                  file,
                  props: {
                    'onClick:remove': () => onClickRemove(i),
                  },
                }

                return (
                  <VDefaultsProvider
                    key={ i }
                    defaults={{
                      VFileUploadItem: {
                        file,
                        clearable: props.clearable,
                        disabled: props.disabled,
                        showSize: props.showSize,
                      },
                    }}
                  >
                    { slots.item?.(slotProps) ?? (
                      <VFileUploadItem
                        key={ i }
                        onClick:remove={ () => onClickRemove(i) }
                        v-slots={ slots }
                      />
                    )}
                  </VDefaultsProvider>
                )
              })}
            </div>
          )}
        </>
      )
    })
  },
})

export type VFileUpload = InstanceType<typeof VFileUpload>
