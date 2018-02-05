# Facebook Chat Assistant
Facebook Chat Assistant is a bot written in Typescript, intended to be used with group chats on facebook. It is created to manage group chats and help out the users where it can. The bot is modular and extensible in the sense that you extend one of the three module-types to add functionality to the bot.

The bot is written in [Node.js](https://nodejs.org/en/), using the [Unofficial Facebook Chat API](https://github.com/Schmavery/facebook-chat-api) and a typings definition that can be found [here](https://github.com/kissorjeyabalan/facebook-chat-api-typings).

## Installation
Clone the repository:
`git clone https://github.com/kissorjeyabalan/facebook-chat-assistant.git`

Copy the example config file and update the values:
`cp config_example.yml config.yml`
`vim config.yml`

### Running inside docker-multi container
Run the start script:
`./start.sh`
This script will build the required Docker images and start the bot in detached mode.
You can safely exit the log window, as the bot will run in the background.

To stop the bot and it's Docker containers:
`./stop.sh`

To transpile new modules you've written to javascript and rebuild the container with the changes:
`./build.sh`

### Running without docker-multi container
Start your MongoDB server and update the mongo host and port in `config.yml`.
Set `account.state` to a directory you have write access to.

Install dependencies:
`npm install`
Build:
`npm run build`
Start:
`npm start`
You can also rebuild and start:
`npm run cleanrun`

## Modules
You can extend the bot with your own commands by editing or creating new functions in the `src/module` folder.
There are four types of modules:
- `Command`:
    - Type of module that can only be executed by prefixing a message with the `bot.trigger` defined in `config.yml`.
    - Created by extending the `Command` class. Must be placed in `src/module/command`.
    - All commands in the `src/module/command`directory is enabled by default. Can be disabled in `config.yml`.
- `Handler`:
    - Type of module that receives all messages.
    - Created by extending the `Handler` class. Must be placed in `src/module/handler`.
    - The order the handlers are executed is determined by the order specified in `config.yml`.
    - Handlers not specified in `config.yml` is disabled by default.
    - If a handler returns a rejected promise, the handlers after that one will not be executed.
- `Eggs`:
    - Type of module that uses regex to recognize commands.
    - Created by extending the `EasterEgg` class. Must be placed in the `src/module/egg` folder.
    - Eggs not specified in `config.yml` is disabled by default.
- `Schedule`:
    - Type of module that is time-based, running tasks at a specific time.
    - Created by extending the `Schedule` class. Must be placed in `src/module/schedule/`.
    - Schedules not specified in `config.yml` at `crons` is disabled by default.
    - Threads not specified in `cronsubs` won't receive scheduled jobs. You can subscribe a thread by typing `<trigger> enable cronjobs` in the chat, or manually specifiying the thread in `config.yml`.

## Help
To see a list of pre-installed commands available, type `<trigger> help` in the chat.