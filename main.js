import { InstanceBase, InstanceStatus, runEntrypoint, TCPHelper } from '@companion-module/base'
import { ConfigFields } from './config.js'
import { getActionDefinitions } from './actions.js'
import { getPresetDefinitions } from './presets.js'
import { getVariableDefinitions } from './variables.js'
import { getFeedbackDefinitions } from './feedbacks.js'

class PptVideoTcp extends InstanceBase {
    async init(config) {
        this.config = config
        // Actions, presets, feedbacks e variáveis
        this.setActionDefinitions(getActionDefinitions(this))
        this.setPresetDefinitions(getPresetDefinitions())
        this.setFeedbackDefinitions(getFeedbackDefinitions(this))
        this.setVariableDefinitions(getVariableDefinitions())

        // 🔹 Valores iniciais (para não aparecer $NA)
        this.init_module_variables()

        await this.configUpdated(config)
    }

    async configUpdated(config) {
        if (this.socket) {
            this.socket.destroy()
            delete this.socket
        }

        this.config = config
        this.init_tcp()
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
    init_module_variables() {
        const initialValues = {
            // TIMER zerado
            timer: 'TIMER',
            timer_hours: 'HOUR',
            timer_minutes: 'MIN',
            timer_seconds: 'SEC',

            // SLIDES
            slide_info: 'SLIDES',
            remaining_slide_info: 'RESTANTES',
            freeze_state: 'FREEZE',
        }


        this.setVariableValues(initialValues)
    }
    // ---------------------------------------------------------------------
    // TCP
    // ---------------------------------------------------------------------
    init_tcp() {
        if (this.socket) {
            this.socket.destroy()
            delete this.socket
        }

        this.updateStatus(InstanceStatus.Connecting)

        if (!this.config.host) {
            this.updateStatus(InstanceStatus.BadConfig)
            return
        }

        this.socket = new TCPHelper(this.config.host, this.config.port)

        this.socket.on('status_change', (status, message) => {
            this.updateStatus(status, message)
        })

        // Processamento dos dados recebidos via TCP
        this.socket.on('data', (data) => {
            const message = data.toString('utf8')
            const params = new URLSearchParams(message)

            // ------------------------------
            // 1) TIMER
            // ------------------------------


            const hours = params.get('hours')
            const minutes = params.get('minutes')
            const seconds = params.get('seconds')
            const time = params.get('time')

            if (hours !== null && minutes !== null && seconds !== null && time !== null) {
                const hr = String(hours).padStart(2, '0')
                const min = String(minutes).padStart(2, '0')
                const sec = String(seconds).padStart(2, '0')

                // Atualiza as variáveis do temporizador
                this.setVariableValues({
                    timer_hours: hr,
                    timer_minutes: min,
                    timer_seconds: sec,
                    timer: `${hr}:${min}:${sec}`,  // Formato como "HH:MM:SS"
                })

                // Necessário para o feedback do TIMER funcionar
                this.checkFeedbacks()

                this.log('info', `Received time: ${hr}:${min}:${sec}`)
            }

            // ------------------------------
            // 2) SLIDE INFO
            // ------------------------------
            let slideInfo = params.get('slide_info')

            if (slideInfo !== null) {
                slideInfo = slideInfo.replace(/Slide/i, '').replace(/\n/g, '').trim()

                this.setVariableValues({ slide_info: slideInfo })
                this.checkFeedbacks()
                this.log('info', `Received slide info: ${slideInfo}`)
            }

            // ------------------------------
            // 3) SLIDE REMAINING INFO  ✅ ADICIONADO
            // ------------------------------
            let remainingInfo = params.get('remaining_slide_info')

            if (remainingInfo !== null) {
                this.setVariableValues({
                    remaining_slide_info: remainingInfo,
                })

                this.checkFeedbacks()
                this.log('info', `Received remaining slides: ${remainingInfo}`)
            }
            // ------------------------------
            // 4) FREEZE STATE  🔥 NOVO
            // ------------------------------
            const freezeState = params.get('freeze_state')

            if (freezeState !== null) {
                this.setVariableValues({ freeze_state: freezeState })
                this.checkFeedbacks()
                this.log('info', `Received freeze state: ${freezeState}`)
            }

            // ----------------------------------------------
            //  ACTIVE PPT / VIDEO
            // ----------------------------------------------
            const activeFile = params.get('active_file')
            if (activeFile !== null) {
                this.setVariableValues({ active_file: activeFile })
                this.checkFeedbacks()
                this.log('info', `Active file: ${activeFile}`)
            }

            // ----------------------------------------------
            //  NEXT FILE (próximo PPT ou VIDEO)
            // ----------------------------------------------
            const nextFile = params.get('next_file')
            if (nextFile !== null) {
                this.setVariableValues({ next_file: nextFile })
                this.checkFeedbacks()
                this.log('info', `Next file: ${nextFile}`)
            }


            // ------------------------------
            // 3) LABELS PPT / VIDEO
            // ------------------------------
            const labelUpdates = {}

            // Processa as labels de PPT
            for (const [key, value] of params.entries()) {
                let m

                if ((m = /^ppt(\d{2})_label$/i.exec(key))) {
                    const id = m[1]
                    labelUpdates[`ppt_name_${id}`] = value
                }

                // Processa as labels de vídeo
                if ((m = /^video(\d{2})_label$/i.exec(key))) {
                    const id = m[1]
                    labelUpdates[`video_name_${id}`] = value
                }
            }

            // Atualiza as variáveis se houver alterações
            if (Object.keys(labelUpdates).length > 0) {
                this.setVariableValues(labelUpdates)
                this.log('info', `Received labels: ${Object.keys(labelUpdates).join(', ')}`)
            }
        })

        this.socket.on('error', (err) => {
            this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
            this.log('error', 'Network error: ' + err.message)
        })
    }
}

runEntrypoint(PptVideoTcp, [])
