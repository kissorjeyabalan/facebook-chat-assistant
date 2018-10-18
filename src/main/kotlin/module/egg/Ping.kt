package module.egg

import externals.facebook.MessageEvent
import kotlin.js.Promise

class Ping: Egg {
    override val regex: Regex = """ping""".toRegex(setOf(RegexOption.IGNORE_CASE))

    override fun run(message: MessageEvent): Promise<Any> {
        Global.instance.api?.sendMessage("Pong!", message.threadID)
        return Promise.resolve(message)
    }
}