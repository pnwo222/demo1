import type { App, Component } from 'vue'
import { camelize } from './index'

interface EventShim {
  new (...args: any[]): {
    $props: {
      onClick?: (...args: any[]) => void
    }
  }
}

export type WithInstall<T> = T & {
  install: (app: App) => void
} & EventShim

export function withInstall<T extends Component>(options: T) {
  (options as Record<string, unknown>).install = (app: App) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { __name, name } = options
    const NAME = name || __name
    if (NAME) {
      app.component(NAME, options)
      if (NAME !== camelize(`-${NAME}`))
        app.component(camelize(`-${NAME}`), options)
    }
  }

  return options as WithInstall<T>
}
