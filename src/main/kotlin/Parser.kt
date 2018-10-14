import externals.facebook.MessageEvent
import handler.CommandHandler
import handler.RegexHandler
import kotlin.js.Promise

class Parser {
    private val handlers = arrayListOf(
            CommandHandler(),
            RegexHandler()
    )

    fun handle(message: MessageEvent) {
        var promise = Promise.resolve(message)
        for (handler in handlers) {
            promise = promise.then { msg -> handler.handle(msg) }
        }
    }
}