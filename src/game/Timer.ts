import EventEmitter from 'events'

export class Timer extends EventEmitter {
  private minutes: number
  private seconds: number
  private inv: NodeJS.Timer
  private canceled = false

  constructor(minutes: number, seconds: number) {
    super()
    this.minutes = minutes
    this.seconds = seconds
  }
  
  public start(): Promise<boolean> {
    return new Promise((res) => {
      this.inv = setInterval(() => {
        if (this.canceled) {
          clearInterval(this.inv)

          return res(false)
        }
        if (this.seconds <= 0 && this.minutes <= 0) {
          clearInterval(this.inv)

          return res(true)
        } else if (this.seconds <= 0) {
          this.seconds = 59
          this.minutes --
        } else {
          this.seconds --
        }
        this.emit("tick", this.getFormatedTime())
      }, 1000)
    })
  }
  public cancel(): void {
    this.canceled = true
  }
  public getFormatedTime(): string {
    if (this.seconds <= 9) return `${this.minutes}:0${this.seconds}`

    return `${this.minutes}:${this.seconds}`
  }
}
