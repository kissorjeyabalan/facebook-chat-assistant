package module.egg

import externals.facebook.MessageEvent
import kotlin.js.Promise

interface Egg {
    val regex: Regex
    fun run(message: MessageEvent): Promise<Any>
}