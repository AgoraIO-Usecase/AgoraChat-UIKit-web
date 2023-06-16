import { CurrentConversation } from '../store/ConversationStore';
declare const useHistoryMessages: (cvs: CurrentConversation) => {
    historyMsgs: any;
    loadMore: () => void;
    isLoading: boolean;
};
export { useHistoryMessages };
