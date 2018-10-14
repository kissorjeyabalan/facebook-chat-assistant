import config.Configuration
import externals.facebook.Event
import externals.facebook.MessageEvent
import handler.CommandHandler
import handler.Handler
import kotlin.js.Promise

class Parser {
    val config = Configuration.instance
    private val handlers = arrayListOf<Handler>(
            CommandHandler()
    )

    fun handle(message: MessageEvent) {
        var promise = Promise.resolve(message)
        for (handler in handlers) {
            promise = promise.then { msg -> handler.handle(msg) }
        }
    }
}