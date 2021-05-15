import fetch from "node-fetch"

export interface CarItem {
  year: string
  make: string
  model: string
  category: string
}

let carData: CarItem[] | null = null
export default async function getCarData(): Promise<CarItem[]> {
  if (!carData) {
    carData = await fetchCarData()
  }

  return carData
}

async function fetchCarData(): Promise<CarItem[]> {
  const response = await fetch(
    "https://parseapi.back4app.com/classes/Car_Model_List?limit=15000",
    {
      headers: {
        "X-Parse-Application-Id": "hlhoNKjOvEhqzcVAJ1lxjicJLZNVv36GdbboZj3Z",
        "X-Parse-Master-Key": "SNMJJF0CZZhTPhLDIqGhTlUNV9r60M2Z5spyWfXW",
      },
    },
  )

  const data = (await response.json()) as {
    results: Array<{
      Year: number
      Make: string
      Model: string
      Category: string
    }>
  }

  return data.results.map(
    ({
      Year: year,
      Make: make,
      Model: model,
      Category: category,
      ...rest
    }) => ({
      year: `${year}`,
      make,
      model,
      category,
      ...rest,
    }),
  )
}
