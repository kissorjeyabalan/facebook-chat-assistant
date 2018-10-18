package module.command

import externals.facebook.MessageEvent
import handler.HelpDetails
import kotlin.js.Promise

class RepeatCommand : Command {
    override val help: HelpDetails = HelpDetails("repeat", "repeat")

    override fun run(msg: MessageEvent, args: String): Promise<Any> {
        Global.instance.api?.sendMessage(args, msg.threadID)
        return Promise.resolve(msg)
    }

    override fun isValid(args: String): Boolean {
        return args.isNotEmpty()
    }
}