package handler
import externals.facebook.Event

interface Handler {
    fun handle(message: Event): Event
}