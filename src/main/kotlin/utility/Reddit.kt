package utility
import config.Configuration
import externals.SnooWrap
import externals.require
import kotlin.js.Promise

class Reddit {

    companion object {
        var shared: Reddit = Reddit()
    }

    private val config = Configuration.shared
    private val thing = JSON.parse<dynamic>("""{
        "userAgent": "${config.get("bot.name.nick")}/v1",
        "clientId": "${config.get("reddit.clientId")}",
        "clientSecret": "${config.get("reddit.clientSecret")}",
        "username": "${config.get("reddit.username")}",
        "password": "${config.get("reddit.password")}"
    }""".trimIndent())
    val snoo = SnooWrap(thing)

    fun getRandomSubmission(subreddit: String, callback: (post: dynamic) -> Unit): Promise<dynamic> {
        return snoo.getRandomSubmission(subreddit).then { post: dynamic ->
            callback(post)
        }
    }
}