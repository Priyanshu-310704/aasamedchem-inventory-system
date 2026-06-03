export const WEIGHT = {
  g: 1,
  kg: 1000,
} as const

export const VOLUME = {
  mL: 1,
  L: 1000,
} as const

export const COUNT = {
  item: 1,
} as const

export type Dimension = "WEIGHT" | "VOLUME" | "COUNT"
export type WeightUnit = keyof typeof WEIGHT
export type VolumeUnit = keyof typeof VOLUME
export type CountUnit = keyof typeof COUNT
export type Unit = WeightUnit | VolumeUnit | CountUnit
export type BaseUnit = "g" | "mL" | "item"

const unitMaps = {
  WEIGHT,
  VOLUME,
  COUNT,
} as const

const baseUnits = {
  WEIGHT: "g",
  VOLUME: "mL",
  COUNT: "item",
} as const

export function getBaseUnit(dimension: Dimension): BaseUnit {
  return baseUnits[dimension]
}

export function getUnits(dimension: Dimension): Unit[] {
  return Object.keys(unitMaps[dimension]) as Unit[]
}

export function toBaseUnit(quantity: number, unit: Unit, dimension: Dimension): number {
  const factor = unitMaps[dimension][unit as never]

  if (!factor) {
    throw new Error(`Invalid unit ${unit} for ${dimension}`)
  }

  return quantity * factor
}

export function fromBaseUnit(quantity: number, unit: Unit, dimension: Dimension): number {
  const factor = unitMaps[dimension][unit as never]

  if (!factor) {
    throw new Error(`Invalid unit ${unit} for ${dimension}`)
  }

  return quantity / factor
}
