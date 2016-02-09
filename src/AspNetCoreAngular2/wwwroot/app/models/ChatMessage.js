var ChatMessage = (function () {
    function ChatMessage(message, date) {
        this.Message = message;
        this.Sent = new Date(date);
    }
    return ChatMessage;
})();
exports.ChatMessage = ChatMessage;
//# sourceMappingURL=ChatMessage.js.map