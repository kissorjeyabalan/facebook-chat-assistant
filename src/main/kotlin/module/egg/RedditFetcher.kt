package module.egg

import externals.facebook.MessageEvent
import externals.require
import utility.Reddit
import kotlin.js.Promise

class RedditFetcher : Egg {
    override val regex: Regex
        get() = """^r .*$""".toRegex()
    val lodash = require("lodash")

    override fun run(message: MessageEvent): Promise<Any> {
        if (isValid(message.body)) {
            val sub = message.body.split(" ")[1]
            Reddit.shared.snoo.getHot(sub, JSON.parse("{\"limit\": 100}")).then {posts: dynamic ->
                if (posts == null) {
                    Global.instance.api?.sendMessage("/r/$sub is empty.", message.threadID)
                    return@then Promise.resolve(message)
                } else {
                    val randItem = lodash.sample(posts)
                    val title = randItem.title
                    if (randItem.hasOwnProperty("url") as Boolean) {
                        Global.instance.api?.sendMessage("has url ${randItem.url}", message.threadID)
                    } else {
                        Global.instance.api?.sendMessage("Has no url", message.threadID)
                    }
                }
            }
        }
        return Promise.resolve(message)
    }

    private fun isValid(message: String): Boolean {
        return message.split(" ").size == 2
    }
}