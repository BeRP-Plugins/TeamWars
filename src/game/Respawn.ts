import TeamWars from "src"
import {
  Player, 
  PluginApi,
} from "src/@interface/pluginApi.i"
import { Timer } from "./Timer"

export class Respawn {
  private api: PluginApi
  private plugin: TeamWars
  private player: Player
  private timer: Timer

  constructor(api: PluginApi, plugin: TeamWars, player: Player) {
    this.api = api
    this.plugin = plugin
    this.player = player
  }
  public start(): Promise<boolean> {
    return new Promise(async (res) => {
      this.timer = new Timer(this.plugin.config.timers.respawn.minutes, this.plugin.config.timers.respawn.seconds)
      this.timer.on("tick", () => this.tick())
      const time = await this.timer.start()

      return res(time)
    })
  }
  private tick(): void {
    this.player.executeCommand(`tp @s ${this.plugin.config.gameSettings.respawnTimerLocation}`)
    this.player.executeCommand(`effect @s blindness 2 255 true`)
  }
}
