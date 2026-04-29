export const toFarsiNumber = (value: number | string) => {
  const farsiDigits = [`۰`, `۱`, `۲`, `۳`, `۴`, `۵`, `۶`, `۷`, `۸`, `۹`]

  return value.toString().replace(/\d/g, (digit) => farsiDigits[Number(digit)])
}

export const formatPersianDate = (isoDate: string, options?: Intl.DateTimeFormatOptions) => {
  const date = new Date(`${isoDate}T00:00:00.000Z`)

  if (Number.isNaN(date.getTime())) {
    return isoDate
  }

  return new Intl.DateTimeFormat(`fa-IR`, options || {
    dateStyle: `long`,
    timeZone: `UTC`,
  }).format(date)
}
