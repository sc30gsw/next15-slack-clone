export const IMAGE_TYPES = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif']
export const MAX_IMAGE_SIZE = 4.5

// biome-ignore lint/style/useNamingConvention: This is used in validation
export const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024)
  return +result.toFixed(decimalsNum)
}
