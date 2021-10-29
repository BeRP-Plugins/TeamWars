import EventEmitter from 'events'
import TeamWars from 'src'
import {
  Player,
  PluginApi,
} from '../@interface/pluginApi.i'
import { Timer } from './Timer'

export class Game extends EventEmitter {
    private api: PluginApi
    private plugin: TeamWars
    private timer: Timer
    private inv: NodeJS.Timer
    private pregameQue = new Map<string, Player>()
    private gameStage = "pregame"
    private teams = {
      red: {
        players: new Map<string, Player>(),
        hasLandmark: true,
      },
      blue: {
        players: new Map<string, Player>(),
        hasLandmark: true,
      },
      yellow: {
        players: new Map<string, Player>(),
        hasLandmark: true,
      },
      green: {
        players: new Map<string, Player>(),
        hasLandmark: true,
      },
    }

    constructor(api: PluginApi, plugin: TeamWars) {
      super()
      this.api = api
      this.plugin = plugin
      this.playerCheck()
      this.api.getSocketManager().on("Message", (packet) => {
        if (packet.event != "PregameQue") return
        if (!this.api.getPlayerManager().getPlayerList()
          .has(packet.player)) return
        const player = this.api.getPlayerManager().getPlayerByName(packet.player)
        if (this.gameStage != "pregame") return player.sendMessage("§cThere is a game currently running.")
        if (this.pregameQue.size >= 10) return player.sendMessage("§cPre-Game que is full!")
        if (this.pregameQue.has(player.getName())) return player.sendMessage("§cYou are already in the Pre-Game que.")
        this.pregameQue.set(player.getName(), player)

        return player.sendMessage("§aYou have joined the Pre-Game que.")
      })
      this.api.getEventManager().on("PlayerLeft", (player) => { 
        // TODO: handle gamestages
        if (!this.pregameQue.has(player.getName())) return
        this.pregameQue.delete(player.getName())
        this.api.getLogger().warn(`${player.getName()} was in the pregame que, but decided to leave the game. They are no longer in the que.`)
      })
    }

    private playerCheck(): void {
      this.inv = setInterval(() => {
        if (this.pregameQue.size >= this.plugin.config.gameSettings.minPlayersForStart) {
          clearInterval(this.inv)

          return this.emit("ReadyForStart")
        }
      })
    }
    public async startPreGameTimer(): Promise<void> {
      this.timer = new Timer(this.plugin.config.timers.preGameTimer.minutes, this.plugin.config.timers.preGameTimer.seconds)
      this.timer.on("tick", (data) => this.emit("TimeUpdated", data))
      const res = await this.timer.start()
      if (!res) return this.api.getLogger().warn("The PreGameTimer was canceled for some reason.")
      this.emit("PreGameTimerFininshed")
    }
    public cancelPreGameTimer(): void {
      if (!this.timer) return
      this.emit("PreGameTimerCanceled")

      return this.timer.cancel()
    }
    public startGame(): void {
      this.gameStage = "game"
      let curTeam = 0
      for (const [, player] of this.pregameQue) {
        switch (curTeam) {
        case 0:
          this.teams.red.players.set(player.getName(), player)
          break
        case 1:
          this.teams.blue.players.set(player.getName(), player)
          break
        case 2:
          this.teams.yellow.players.set(player.getName(), player)
          break
        case 3:
          this.teams.green.players.set(player.getName(), player)
          break
        case 4:
          this.teams.red.players.set(player.getName(), player)
          break
        case 5:
          this.teams.blue.players.set(player.getName(), player)
          break
        case 6:
          this.teams.yellow.players.set(player.getName(), player)
          break
        case 7:
          this.teams.green.players.set(player.getName(), player)
          break
        case 8:
          this.teams.red.players.set(player.getName(), player)
          break
        case 9:
          this.teams.blue.players.set(player.getName(), player)
          break
        }
        curTeam ++
      }
      this.teleportPlayers()
      for (const command of this.plugin.config.startGameCommands) {
        this.api.getCommandManager().executeCommand(command)
      }
    }
    private teleportPlayers(): void {
      for (const [, player] of this.teams.red.players) {
        player.executeCommand(`tp @s ${this.plugin.config.gameSettings.teamSpawnLocations.red}`)
      }
      for (const [, player] of this.teams.blue.players) {
        player.executeCommand(`tp @s ${this.plugin.config.gameSettings.teamSpawnLocations.blue}`)
      }
      for (const [, player] of this.teams.yellow.players) {
        player.executeCommand(`tp @s ${this.plugin.config.gameSettings.teamSpawnLocations.yellow}`)
      }
      for (const [, player] of this.teams.green.players) {
        player.executeCommand(`tp @s ${this.plugin.config.gameSettings.teamSpawnLocations.green}`)
      }
    }
    public getFormatedTime(): string {
      if (!this.timer) return "0:00"

      return this.timer.getFormatedTime()
    }
    public getPreGameQue(): Map<string, Player> { return this.pregameQue }
}
