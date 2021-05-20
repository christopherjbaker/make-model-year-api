export default function countBy<T extends { [key: string]: any }>(
  list: Array<T>,
  filters: Partial<T>,
  key: keyof T,
): Array<Partial<T> & { count: number }> {
  const counts: { [key: string]: number } = {}
  item: for (const item of list) {
    for (const filter in filters) {
      if (filters[filter] && item[filter] !== filters[filter]) {
        continue item
      }
    }

    const value = item[key]

    if (!counts[value]) {
      counts[value] = 0
    }

    counts[value]++
  }

  const output = Object.keys(counts).map(
    (make) =>
      ({
        [key]: make,
        count: counts[make],
      } as Partial<T> & { count: number }),
  )

  output.sort((a, b) => (b[key].toLowerCase() > a[key].toLowerCase() ? -1 : 1))

  return output
}
