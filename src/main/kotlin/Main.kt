import config.Configuration
import externals.facebook.Api
import externals.require

val fb = require("facebook-chat-api")
val _config = Configuration.instance

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

    /*fb(creds) { err, api: Api ->
        if (err) return@fb console.error(err.error)

        api.listen { err, message ->
            if (err) return@listen console.error(err)
            console.info(message)
        }
    }*/
}