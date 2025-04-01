import { Avatar } from '@/components/justd/ui'

type ConversationHeroProps = {
  name?: string
  image?: string
}

export const ConversationHero = ({
  name = 'Member',
  image,
}: ConversationHeroProps) => {
  return (
    <div className="mt-22 mx-5 mb-4">
      <div className="flex items-center gap-x-1 mb-2">
        <Avatar
          alt={name}
          shape="square"
          size="special-large"
          src={image}
          initials={name.charAt(0).toUpperCase()}
          className="mr-2 bg-sky-500 text-white flex items-center justify-center"
        />
        <p className="text-2xl font-bold">{name}</p>
      </div>
      <p className="font-normal text-slate-800 mb-4">
        This conversation is just between you and <strong>{name}</strong>
      </p>
    </div>
  )
}
