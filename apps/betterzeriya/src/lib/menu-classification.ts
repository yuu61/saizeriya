export type AlcoholClassifiableMenuItem = {
  name?: string
  kana?: string
  category?: string
  tags?: string[]
  alcoholCheck?: number
}

const normalizeClassificationText = (value: string) =>
  value.normalize('NFKC').replaceAll(/\s+/g, '').toUpperCase()

const nonAlcoholKeywords = ['ノンアルコール', 'ノンアル', 'NONALCOHOL', 'NON-ALCOHOL'].map(
  (value) => normalizeClassificationText(value),
)

const alcoholKeywords = [
  'アルコール',
  'お酒',
  '酒類',
  'ワイン',
  'ビール',
  'ジョッキ',
  'サワー',
  'ハイボール',
  'ウイスキー',
  'ウィスキー',
  '焼酎',
  '日本酒',
  'カクテル',
  'シャンパン',
  'スパークリング',
  'デカンタ',
  'マグナム',
  'ランブルスコ',
  'キャンティ',
  'ベルデッキオ',
  'ドンラファエロ',
  'グラッパ',
  '氷結',
].map((value) => normalizeClassificationText(value))

export const isAlcoholMenuItem = (item: AlcoholClassifiableMenuItem) => {
  if (item.alcoholCheck !== undefined) {
    return item.alcoholCheck === 1
  }

  const text = [item.name, item.kana, item.category, ...(item.tags ?? [])]
    .filter((value): value is string => Boolean(value))
    .map((value) => normalizeClassificationText(value))
    .join(' ')

  if (!text || nonAlcoholKeywords.some((keyword) => text.includes(keyword))) {
    return false
  }

  return alcoholKeywords.some((keyword) => text.includes(keyword))
}
