import { PluginApi } from './@interface/pluginApi.i'
import { Config } from './@interface/TeamWars.i'
import path from 'path'
import fs from 'fs'
import { GameManager } from './game/GameManager'

class TeamWars {
    private api: PluginApi
    public config: Config
    private gameManager: GameManager

    constructor(api: PluginApi) {
      this.api = api
      this.config = JSON.parse(fs.readFileSync(path.resolve(this.api.path + "/config.json"), "utf-8"))
      this.gameManager = new GameManager(this.api, this)
    }

    public onLoaded(): void {
      this.api.getLogger().info('Loaded!')
    }
    public onEnabled(): void {
      this.api.getLogger().info('Enabled!')
      this.gameManager.onEnabled()
    }
    public onDisabled(): void {
      this.api.getLogger().info('Disabled!')
      this.gameManager.onDisabled()
    }
}

export = TeamWars
