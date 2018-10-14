package handler

import config.Configuration
import externals.facebook.MessageEvent
import kotlinx.coroutines.experimental.GlobalScope
import kotlinx.coroutines.experimental.delay
import kotlinx.coroutines.experimental.launch
import module.command.RepeatCommand
import module.egg.Egg
import module.egg.Ping

class RegexHandler : Handler {
    private val eggs = HashMap<Regex, Egg>()

    init {
        val instances = arrayListOf(
                Ping()
        )

        for (instance in instances) {
            val enabled = Configuration.instance
                    .isEggEnabled(instance::class.js.name)

            if (enabled) {
                eggs[instance.regex] = instance
                console.info("Regex Command ${instance::class.js.name} enabled.")
            } else {
                console.info("Regex Command ${instance::class.js.name} disabled.")
            }
        }
    }

    override fun handle(message: MessageEvent): MessageEvent {
        for ((regex, egg) in eggs) {
            if (regex.matches(message.body)) {
                GlobalScope.launch {
                    delay(444)
                    Global.instance.api?.markAsRead(message.threadID)
                }
                egg.run(message)
                return message
            }
        }
        return message
    }
}