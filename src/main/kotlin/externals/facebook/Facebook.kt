@file:JsModule("facebook-chat-api")
package externals.facebook


external interface Event {
 val type: String
}

external class MessageEvent: Event {
    val attachments: dynamic
    val body: String
    val isGroup: Boolean
    val mentions: dynamic
    val messageID: String
    val senderID: String
    val threadID: String
    val isUnread: Boolean
    override val type: String
}

external class Api {
    fun listen(handler: (error: dynamic, message: MessageEvent) -> Unit)
}