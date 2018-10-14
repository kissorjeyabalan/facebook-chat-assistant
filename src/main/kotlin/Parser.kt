import config.Configuration
import externals.facebook.Event
import handler.CommandHandler
import handler.Handler

class Parser {
    val config = Configuration.instance
    val handlers = arrayListOf<Handler>(
            CommandHandler()
    )

    fun handle(cmd: Event): Event {
        for (handler in handlers) {
            handler.handle(cmd)
        }
        return cmd
    }
}