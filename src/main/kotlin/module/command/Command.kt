package module.command

import externals.facebook.MessageEvent
import handler.HelpDetails
import kotlin.js.Promise

interface Command {
    val help: HelpDetails
    fun run(msg: MessageEvent, args: String): Promise<Any>
    fun isValid(args: String): Boolean
}