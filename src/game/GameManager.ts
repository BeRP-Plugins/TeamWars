import EventEmitter from 'events'
import TeamWars from 'src'
import { PluginApi } from '../@interface/pluginApi.i'
import { Game } from './Game'

export class GameManager extends EventEmitter {
    private api: PluginApi
    private plugin: TeamWars
    private game: Game

    constructor(api: PluginApi, plugin: TeamWars) {
      super()
      this.api = api
      this.plugin = plugin
    }

    public onEnabled(): void {
      this.createGame()
    }
    public onDisabled(): void {
      //
    }
    public createGame(): void {
      if (this.game) return this.api.getLogger().error("There is a game active already.")
      this.game = new Game(this.api, this.plugin)
      this.game.once("ReadyForStart", () => this.handleGame())
    }
    private handleGame(): void {
      this.game.startPreGameTimer()
      this.game.once("PreGameTimerFininshed", () => this.game.startGame())
      this.game.on("TimeUpdated", (data) => console.log(data))
    }
}
