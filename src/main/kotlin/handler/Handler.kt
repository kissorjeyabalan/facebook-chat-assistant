package handler
import externals.facebook.MessageEvent

interface Handler {
    fun handle(message: MessageEvent): MessageEvent
}