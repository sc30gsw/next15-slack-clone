import 'server-only'

export const generateJoinCode = () => {
  const code = Array.from(
    { length: 6 },
    () =>
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[
        Math.floor(Math.random() * 62)
      ],
  ).join('')

  return code
}
