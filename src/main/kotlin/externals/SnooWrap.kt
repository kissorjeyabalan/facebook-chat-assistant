package externals

import kotlin.js.Promise

@JsModule("snoowrap")
external class SnooWrap(config: Any) {
    fun getRandomSubmission(subreddit: String): Promise<dynamic>
    fun getHot(sub: String, parse: dynamic): Promise<dynamic>
}