import type { CartItem, PageSubmitFields } from '../types'

const pad2 = (value: number) => value.toString().padStart(2, '0')

export const nowOrderTime = () => {
  const now = new Date()
  return `${now.getFullYear()}/${pad2(now.getMonth() + 1)}/${pad2(now.getDate())},${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`
}

export const createBaseFields = (proc: string, token?: string): Record<string, string> => ({
  proc,
  ctrl: '',
  sub_ctrl: '',
  cur_lang: '1',
  message: '',
  ...(token ? { token } : {}),
})

export const createSearchParams = (
  fields: Record<string, string | number | boolean | undefined>,
) => {
  const body = new URLSearchParams()
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      body.append(key, value.toString())
    }
  }
  return body
}

export const createOrderSubmitBody = (token: string, cart: CartItem[]) => {
  const body = createSearchParams({
    ...createBaseFields('order', token),
    ctrl: 'remember',
    code: '',
    'drinkbar-cnt': '0',
    'alcohol-cnt': '0',
    'ord-drkbar-cnt': '0',
  } satisfies PageSubmitFields)

  for (const item of cart) {
    body.append('item[id][]', item.id)
    body.append('item[reorder][]', item.reorder.toString())
    body.append('item[count][]', item.count.toString())
    body.append('item[mod_id][]', item.modId)
    body.append('item[mod_count][]', item.modCount.toString())
  }

  return body
}
