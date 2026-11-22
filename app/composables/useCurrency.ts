export const useCurrency = () => {
  const formatRupiah = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace(/\s/g, ' ')
  }

  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) return '0'
    return new Intl.NumberFormat('id-ID').format(value)
  }

  return {
    formatRupiah,
    formatNumber
  }
}

