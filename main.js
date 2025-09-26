import { InstanceBase, InstanceStatus, runEntrypoint, TCPHelper } from '@companion-module/base'
import { ConfigFields } from './config.js'
import { getActionDefinitions } from './actions.js'
import { getPresetDefinitions } from './presets.js'
import { getVariableDefinitions } from './variables.js' // Importa as variáveis

class PptVideoTcp extends InstanceBase {
    async init(config) {
        this.config = config

        // Actions, presets e variáveis
        this.setActionDefinitions(getActionDefinitions(this))
        this.setPresetDefinitions(getPresetDefinitions())
        await this.configUpdated(config)
        this.init_tcp_variables()
    }

    async configUpdated(config) {
        if (this.socket) {
            this.socket.destroy()
            delete this.socket
        }
        this.config = config
        this.init_tcp()
        this.init_tcp_variables()
    }

    async destroy() {
        if (this.socket) {
            this.socket.destroy()
        } else {
            this.updateStatus(InstanceStatus.Disconnected)
        }
    }

    getConfigFields() {
        return ConfigFields
    }

    init_tcp() {
        if (this.socket) {
            this.socket.destroy()
            delete this.socket
        }

        this.updateStatus(InstanceStatus.Connecting)

        if (this.config.host) {
            this.socket = new TCPHelper(this.config.host, this.config.port)

            this.socket.on('status_change', (status, message) => {
                this.updateStatus(status, message)
            })

            this.socket.on('data', (data) => {
                const message = data.toString('utf8')

                // Usa URLSearchParams para decodificar k=v&k2=v2...
                const params = new URLSearchParams(message)

                // 1) TIMER (se vier)
                const hours = params.get('hours')
                const minutes = params.get('minutes')
                const seconds = params.get('seconds')
                const time = params.get('time')
                if (hours !== null && minutes !== null && seconds !== null && time !== null) {
                    this.setVariableValues({
                        timer_hours: hours,
                        timer_minutes: minutes,
                        timer_seconds: seconds,
                        timer: time,
                    })
                    this.log('info', `Received time: ${time} (H:${hours}, M:${minutes}, S:${seconds})`)
                }

                // 2) SLIDE INFO (se vier)
                const slideInfo = params.get('slide_info')
                if (slideInfo !== null) {
                    this.setVariableValues({ slide_info: slideInfo })
                    this.log('info', `Received slide info: ${slideInfo}`)
                }

                // 3) LABELS de PPT/VIDEO (podem vir vários no mesmo pacote)
                const labelUpdates = {}
                for (const [key, value] of params.entries()) {
                    // value já vem decodificado por URLSearchParams
                    let m
                    if ((m = /^ppt(\d{2})_label$/i.exec(key))) {
                        const idx = m[1] // "01".."40"
                        labelUpdates[`ppt_name_${idx}`] = value || ''
                    } else if ((m = /^video(\d{2})_label$/i.exec(key))) {
                        const idx = m[1] // "01".."20"
                        labelUpdates[`video_name_${idx}`] = value || ''
                    }
                }
                if (Object.keys(labelUpdates).length > 0) {
                    this.setVariableValues(labelUpdates)
                    this.log('info', `Received labels: ${Object.keys(labelUpdates).join(', ')}`)
                }
            })

            this.socket.on('error', (err) => {
                this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
                this.log('error', 'Network error: ' + err.message)
            })
        } else {
            this.updateStatus(InstanceStatus.BadConfig)
        }
    }

    init_tcp_variables() {
        const variables = getVariableDefinitions()
        this.setVariableDefinitions(variables)
    }
}

runEntrypoint(PptVideoTcp, [])
