System.register([], function(exports_1) {
    var ChatMessage;
    return {
        setters:[],
        execute: function() {
            ChatMessage = (function () {
                function ChatMessage(message, date) {
                    this.Message = message;
                    this.Sent = new Date(date);
                }
                return ChatMessage;
            })();
            exports_1("ChatMessage", ChatMessage);
        }
    }
});
//# sourceMappingURL=ChatMessage.js.map