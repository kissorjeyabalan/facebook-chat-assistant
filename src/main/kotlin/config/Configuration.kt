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

    private var config: Any = yaml.safeLoad(fs.readFileSync("config.yml", "utf-8")) as Any

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
}