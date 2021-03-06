export interface Config {
  gameSettings: {
    minPlayersForStart: number
    respawnTimerLocation: string
    teamSpawnLocations: {
      red: string
      blue: string
      yellow: string
      green: string
    }
  }
  timers: {
    preGameTimer: {
      minutes: number
      seconds: number
    }
    gameTimer: {
      minutes: number
      seconds: number
    }
    respawn: {
      minutes: number
      seconds: number
    }
  }
  startGameCommands: string[]
  endGameCommands: string[]
}
