package handler

class HelpDetails(
        val commandName: String,
        val command: String,
        val shortDescription: String = "No description available.",
        val description: String = "No description available.",
        val syntax: String = "No syntax help available.",
        val example: String = "No example available.",
        val hidden: Boolean = false,
        val adminOnly: Boolean = false
)