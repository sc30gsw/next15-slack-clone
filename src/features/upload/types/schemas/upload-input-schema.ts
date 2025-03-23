import { z } from 'zod'

const IMAGE_TYPES = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif']

const MAX_IMAGE_SIZE = 4.5

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024)
  return +result.toFixed(decimalsNum)
}

export const uploadInputSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File, {
      message: 'Image is required',
    })
    .refine((file) => sizeInMB(file.size) <= MAX_IMAGE_SIZE, {
      message: 'The file size must be up to 4.5MB',
    })
    .refine((file) => IMAGE_TYPES.includes(file.type), {
      message: 'The file type must be jpg, png, jpeg, or gif',
    }),
})

export type UploadInput = z.infer<typeof uploadInputSchema>
