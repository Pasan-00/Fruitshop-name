// Utility helpers for unit formatting and normalization
export function formatUnitLabel(amount, unit) {
  if (amount == null || unit == null) return ''
  return `${amount}${unit}`
}

export function getUnitInfo(item) {
  if (!item) return { amount: null, unit: null, label: '' }
  const amount = item.unitAmount ?? (item.unitValue ? parseFloat(String(item.unitValue)) : null)
  const unit = item.unitUnit ?? (item.unitValue ? String(item.unitValue).replace(/^[0-9\s\.]+/, '').trim() : (item.unitType === 'pieces' ? 'piece' : 'g'))
  const label = amount != null ? `${amount}${unit}` : (item.unitValue || (item.unitType === 'pieces' ? '1 piece' : '100g'))
  return { amount, unit, label }
}

export function getStockLabel(item) {
  if (!item) return ''
  const stockUnits = Number(item.stockUnits ?? 0)
  const amountPerUnit = Number(item.unitAmount ?? (item.unitValue ? parseFloat(String(item.unitValue)) : 1))
  const unit = item.unitUnit ?? (item.unitValue ? String(item.unitValue).replace(/^[0-9\s\.]+/, '').trim() : (item.unitType === 'pieces' ? 'piece' : 'g'))

  if (stockUnits <= 0) return 'Out of stock'

  // total amount = stockUnits * amountPerUnit
  const total = stockUnits * amountPerUnit

  // For weight in grams, show in g or kg
  const u = String(unit).toLowerCase()
  if (u === 'g' || u === 'gram' || u === 'grams') {
    if (total >= 1000) {
      const kg = total / 1000
      return `${kg}${'kg'} available`
    }
    return `${total}${'g'} available`
  }

  // For pieces or other units, show total count
  return `${total} ${unit}${total > 1 ? 's' : ''} available`
}

export function computePricePer100g(unitAmount, unitUnit, price) {
  // Returns price per 100g as a number, or null if not applicable
  if (price == null || unitAmount == null || !unitUnit) return null
  const u = String(unitUnit).toLowerCase()
  let gramsPerUnit = null
  if (u === 'g') gramsPerUnit = Number(unitAmount)
  else if (u === 'kg') gramsPerUnit = Number(unitAmount) * 1000
  else if (u === 'gram' || u === 'grams') gramsPerUnit = Number(unitAmount)
  else return null

  if (!gramsPerUnit || gramsPerUnit <= 0) return null

  const pricePerGram = Number(price) / gramsPerUnit
  const pricePer100g = pricePerGram * 100
  return pricePer100g
}

export function formatCurrency(value) {
  if (value == null || Number.isNaN(Number(value))) return ''
  return Number(value).toFixed(2)
}
