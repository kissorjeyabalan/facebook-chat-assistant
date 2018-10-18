package handler

import config.Configuration
import externals.facebook.MessageEvent
import kotlinx.coroutines.experimental.GlobalScope
import kotlinx.coroutines.experimental.delay
import kotlinx.coroutines.experimental.launch
import module.command.Command
import module.command.RepeatCommand

class CommandHandler : Handler {
    private val trigger = Configuration.shared.get("bot.trigger") as String
    private val commands: HashMap<String, Command> = HashMap()

    init {
        val instances = arrayListOf(
                RepeatCommand()
        )

        for (instance in instances) {
            val enabled = Configuration.shared
                    .isCmdEnabled(instance::class.js.name)

            if (enabled) {
                commands[instance.help.command.toLowerCase()] = instance
                console.info("Command ${instance.help.commandName} enabled.")
            } else {
                console.info("Command ${instance.help.commandName} disabled.")
            }
        }
    }

    override fun handle(message: MessageEvent): MessageEvent {
        if (!isCmd(message)) return message

        GlobalScope.launch {
            delay(444)
            Global.instance.api?.markAsRead(message.threadID)
        }

        val cmd = getCmd(message)
        val args = getCmdArgs(message)

        val cmdInstance = commands[cmd] ?: return message

        if (!cmdInstance.isValid(args)) {
            Global.instance.api?.sendMessage("Invalid arguments.", message.threadID)
            return message
        }

        cmdInstance.run(message, args)
        return message
    }

    private fun isCmd(message: MessageEvent): Boolean {
        return message.body.startsWith(prefix = trigger, ignoreCase = true)
    }

    private fun getCmd(message: MessageEvent): String {
        return message.body.removePrefix(trigger).trim().split(" ")[0].toLowerCase()
    }

    private fun getCmdArgs(message: MessageEvent): String {
        return message.body.substring(trigger.length + getCmd(message).length + 1).trim()
    }
}