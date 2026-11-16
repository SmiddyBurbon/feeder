import html2canvas from 'html2canvas'

const SKIPPED_TYPES = new Set(['file', 'checkbox', 'radio', 'hidden', 'range', 'button', 'submit', 'color'])

// Properties that determine how an input's text is laid out; copied as inline styles.
const COPIED_PROPS = [
  'box-sizing', 'width', 'height', 'min-width', 'max-width', 'padding-top', 'padding-right', 'padding-bottom',
  'padding-left', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'font-family', 'font-size',
  'font-weight', 'font-style', 'letter-spacing', 'line-height', 'text-align', 'text-transform', 'color',
  'background-color', 'background-image', 'border-top-width', 'border-right-width', 'border-bottom-width',
  'border-left-width', 'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
  'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color', 'border-radius',
  'position', 'top', 'right', 'bottom', 'left', 'opacity', 'display',
] as const

const JUSTIFY: Record<string, string> = { center: 'center', right: 'flex-end', end: 'flex-end' }

/**
 * html2canvas draws <input>/<textarea> text through its own code path that ignores `text-transform`
 * and does not centre the text vertically. Inside the clone it renders, swap each field for a styled
 * <div> holding the same text, which html2canvas lays out like any other text.
 */
function replaceFormFieldsWithText(clonedDocument: Document, root: HTMLElement) {
  const view = clonedDocument.defaultView
  if (!view) return

  root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea').forEach((field) => {
    if (field instanceof HTMLInputElement && SKIPPED_TYPES.has(field.type)) return

    const style = view.getComputedStyle(field)
    const isTextarea = field instanceof HTMLTextAreaElement
    const showsPlaceholder = field.value === ''
    const text = showsPlaceholder ? field.placeholder : field.value

    const replacement = clonedDocument.createElement('div')
    for (const prop of COPIED_PROPS) replacement.style.setProperty(prop, style.getPropertyValue(prop))
    replacement.className = field.className
    for (const attr of Array.from(field.attributes)) {
      if (attr.name.startsWith('data-v-')) replacement.setAttribute(attr.name, attr.value)
    }

    if (showsPlaceholder) replacement.style.color = view.getComputedStyle(field, '::placeholder').color

    replacement.style.display = style.display.startsWith('inline') ? 'inline-flex' : 'flex'
    replacement.style.alignItems = isTextarea ? 'flex-start' : 'center'
    replacement.style.justifyContent = JUSTIFY[style.textAlign] ?? 'flex-start'
    replacement.style.overflow = 'hidden'
    replacement.style.whiteSpace = isTextarea ? 'pre-wrap' : 'nowrap'
    replacement.textContent = text

    field.parentNode?.insertBefore(replacement, field)
    field.style.display = 'none'
  })
}

export function renderToCanvas(element: HTMLElement, scale = 1) {
  return html2canvas(element, {
    scale,
    onclone: (clonedDocument, clonedElement) => replaceFormFieldsWithText(clonedDocument, clonedElement),
  })
}
