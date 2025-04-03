import { Avatar, Skeleton } from '@/components/justd/ui'
import { ConversationChatInput } from '@/features/conversations/components/conversation-chat-input'
import { ConversationHeader } from '@/features/conversations/components/conversation-header'
import { ConversationHero } from '@/features/conversations/components/conversation-hero'
import { VirtuosoConversationMessageList } from '@/features/conversations/components/virtuoso-conversation-message-list'
import { getConversation } from '@/features/conversations/server/fetcher'
import { MessageListLoader } from '@/features/messages/components/message-list-loader'
import { getSession } from '@/lib/auth/session'
import { IconChevronDown } from 'justd-icons'
import { Suspense } from 'react'

const MemberIdPage = async ({
  params,
}: Record<'params', Promise<Record<'workspaceId' | 'memberId', string>>>) => {
  const session = await getSession()
  const { workspaceId, memberId } = await params

  const conversationPromise = getConversation(
    {
      workspaceId,
      memberTwoId: memberId,
    },
    session?.user?.id,
  )

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b h-12.25 flex items-center px-4 overflow-hidden">
        <ConversationHeader memberId={memberId}>
          <Suspense
            fallback={
              <div className="flex items-center gap-x-2">
                <Skeleton className="size-6" />
                <Skeleton className="h-5 w-30" />
              </div>
            }
          >
            {conversationPromise.then(({ member }) => (
              <>
                <Avatar
                  src={member.image}
                  alt={member.name ?? 'Member'}
                  initials={
                    member.name ? member.name.charAt(0).toUpperCase() : 'M'
                  }
                  size="small"
                  shape="square"
                  className="mr-2 bg-sky-500 text-white"
                />
                <span className="truncate">{member.name}</span>
                <IconChevronDown className="size-2.5 ml-2" />
              </>
            ))}
          </Suspense>
        </ConversationHeader>
      </div>
      <Suspense fallback={<MessageListLoader />}>
        {conversationPromise.then(({ conversation }) => (
          <VirtuosoConversationMessageList
            conversationId={conversation.id}
            userId={session?.user?.id}
            variant="conversation"
          />
        ))}
      </Suspense>
      <Suspense
        fallback={
          <div className="mt-22 mx-5 mb-4">
            <Skeleton className="h-8 w-30 mb-2" />
            <Skeleton className="h-6 w-4/5" />
          </div>
        }
      >
        {conversationPromise.then((conversation) => (
          <ConversationHero
            name={conversation.member.name ?? ''}
            image={conversation.member.image ?? ''}
          />
        ))}
      </Suspense>
      <Suspense fallback={<Skeleton className="h-39 w-248 mx-5 mb-2" />}>
        {conversationPromise.then(({ conversation, member }) => (
          <ConversationChatInput
            placeholder={`Message ${member.name ?? 'Member'}`}
            conversationId={conversation.id}
          />
        ))}
      </Suspense>
    </div>
  )
}

export default MemberIdPage
