import config.Configuration
import externals.facebook.Api
import externals.require
import kotlinx.coroutines.experimental.GlobalScope
import kotlinx.coroutines.experimental.launch
import utility.Reddit

val fb = require("facebook-chat-api")
val _config = Configuration.shared

val creds = if (_config.hasAppState()) {
    JSON.parse<dynamic>("""
        {"appState": ${_config.getAppState()}}
    """.trimIndent())
} else {
    JSON.parse("""
        {"email": "${_config.get("facebook.username")}",
        "password": "${_config.get("facebook.password")}"}
    """.trimIndent())
}

val mp = Parser()

fun main(args: Array<String>) {
    println("Starting Emol v3!")

    fb(creds) { err, api: Api ->
        if (err) return@fb console.error(err.error)
        Global.instance.api = api

        api.listen { err, message ->
            GlobalScope.launch {
                if (err) return@launch console.error(err)
                mp.handle(message)
            }
        }
    }
}