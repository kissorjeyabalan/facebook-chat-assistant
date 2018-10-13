package config
import externals.require
import kotlin.js.Json

class Configuration {
    val lodash = require("lodash")
    val yaml = require("js-yaml")
    val fs = require("fs")

    companion object {
        var instance: Configuration = Configuration()
    }

    private var config: Any? = null

    init {
        try {
            config = yaml.safeLoad(fs.readFileSync("config.yml", "utf-8")) as Any
        } catch (e: dynamic) {
            createDefaultConfig()
            js("throw 'Configuration was missing! Please fill out the generated config.yml'")
        }
    }


    fun has(prop: String): Boolean {
        return lodash.has(config, prop) as Boolean
    }

    fun get(prop: String): Any {
        if (has(prop)) {
            return lodash.get(config, prop) as Any
        } else {
            throw Error("Property $prop was not found in config file.")
        }
    }

    fun remove(prop: String): Boolean {
        val success = lodash.unset(config, prop) as Boolean
        return if (success) {
            val temp = yaml.safeDump(config)
            fs.writeFileSync("./config.yml", temp, "utf-8")
            true
        } else {
            false
        }
    }

    fun add(prop: String, value: Any): Boolean {
        val success = lodash.set(config, prop, value) as Boolean
        return if (success) {
            val temp = yaml.safeDump(config)
            fs.writeFileSync("./config.yml", temp, "utf-8")
            true
        } else {
            false
        }
    }

    private fun createDefaultConfig() {
        val obj = object{}
        lodash.set(obj, "facebook.username", "email")
        lodash.set(obj, "facebook.password", "password")
        lodash.set(obj, "facebook.state", "/path/to/state.json")
        lodash.set(obj, "bot.trigger", "#")
        lodash.set(obj, "bot.name.full", "John Doe")
        lodash.set(obj, "bot.name.nick", "Mr. Bot")
        lodash.set(obj, "bot.id", 123456)
        lodash.set(obj, "bot.admin", 123456)
        lodash.set(obj, "bot.behaviour.logLevel", "warn")
        lodash.set(obj, "bot.behaviour.selfListen", false)
        lodash.set(obj, "bot.behaviour.listenEvents", false)
        lodash.set(obj, "bot.behaviour.pageID", "")
        lodash.set(obj, "bot.behaviour.updatePresence", false)
        lodash.set(obj, "bot.behaviour.forceLogin", false)
        lodash.set(obj, "bot.behaviour.timeout", 30)

        val temp = yaml.safeDump(obj)
        fs.writeFileSync("config.yml", temp, "utf-8")
    }
}