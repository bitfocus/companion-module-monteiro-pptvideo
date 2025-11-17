export function getPresetDefinitions() {
    const presets = {}

    // Função para criar presets com feedback
    function createPreset(id, category, name, text, color, bgcolor, actionId, size = 19) {
        presets[`preset_${id}`] = {
            type: 'button',
            category,
            name,
            style: {
                text,
                size, // Tamanho da fonte 20
                fontWeight: 'bold', // Fonte em negrito
                color: Number(color),
                bgcolor: Number(bgcolor),
                bgcolorVar: true,  // Permite que o feedback altere o fundo
                colorVar: true,    // Permite que o feedback altere a cor
                show_topbar: false,
            },
            steps: [
                {
                    down: actionId ? [{ actionId }] : [],
                    up: [],
                },
            ],
        }
    }

    // ---------------------------------------------------
    // BOTÕES DE COMANDOS
    // ---------------------------------------------------
    const commandPresets = [
        { id: 'esc', name: 'Send ESC Command', text: 'ESC', color: 0xffffff, bgcolor: 0x000000, actionId: 'ESC' },
        { id: 'next', name: 'Send NEXT Command', text: '>\nNext', color: 0xffffff, bgcolor: 0x006400, actionId: 'NEXT' },
        { id: 'previous', name: 'Send PREVIOUS Command', text: '<\nPrev', color: 0xffffff, bgcolor: 0xff0000, actionId: 'PREVIOUS' }, // Background vermelho
        { id: 'exit_ppt', name: 'Send exit PPT Command', text: 'PPT\nEXIT', color: 0xffffff, bgcolor: 0x000000, actionId: 'EXIT_PPT' },
        { id: 'test', name: 'Send TEST Command', text: 'TEST', color: 0xffffff, bgcolor: 0xffa500, actionId: 'TEST' },
        { id: 'link', name: 'Send LINK Command', text: 'LINK', color: 0xffffff, bgcolor: 0x9400d3, actionId: 'LINK' },
        { id: 'save', name: 'Send SAVE Command', text: 'SAVE', color: 0xffffff, bgcolor: 0x38AC38, actionId: 'SAVE' },
        { id: 'save', name: 'Send SAVE Command', text: 'SAVE', color: 0xffffff, bgcolor: 0x38AC38, actionId: 'SAVE' },
        { id: 'freeze_toggle', name: 'Freeze / Unfreeze Screen', text: '$(PPT_VIDEO:freeze_state)', color: 0x000000, bgcolor: 0x3EE6DB, actionId: 'FREEZE_TOGGLE' },
    ]

    commandPresets.forEach((p) =>
        createPreset(p.id, 'PPT', p.name, p.text, p.color, p.bgcolor, p.actionId)
    )

    // ---------------------------------------------------
    // APLICAR FEEDBACKS NO BOTÃO "FREEZE / UNFREEZE"
    // ---------------------------------------------------
    const freezeButtonPreset = presets['preset_freeze_toggle']

    if (freezeButtonPreset) {

        // 🔵 FONTE FIXA 16 SOMENTE PARA O BOTÃO DE FREEZE
        freezeButtonPreset.style.size = 16

        freezeButtonPreset.feedbacks = [
            {
                feedbackId: 'freeze_state',
                callback: () => {
                    const freezeState = self.getVariableValue('freeze_state')?.toLowerCase()
                    return freezeState === 'freeze'
                },
                style: {
                    bgcolor: 0x3EE6DB,
                    color: 0xffffff,
                }
            },
            {
                feedbackId: 'unfreeze_state',
                callback: () => {
                    const freezeState = self.getVariableValue('freeze_state')?.toLowerCase()
                    return freezeState === 'unfreeze'
                },
                style: {
                    bgcolor: 0xff0000,
                    color: 0xffffff,
                }
            }
        ]
    }


    // ---------------------------------------------------
    // Comandos de Controle de Video
    // ---------------------------------------------------
    const videoCommandPresets = [
        { id: 'pause', name: 'Pause Video', text: 'PAUSE', color: 0x000000, bgcolor: 0xffff10, actionId: 'PAUSE' }, // Background amarelo
        { id: 'play', name: 'Play Video', text: 'PLAY', color: 0xffffff, bgcolor: 0x008000, actionId: 'PLAY' },
        { id: 'stop', name: 'Stop Video', text: 'STOP', color: 0xffffff, bgcolor: 0xff0000, actionId: 'STOP' },
        { id: 'exit_video', name: 'Exit Video', text: 'VIDEO EXIT', color: 0xffffff, bgcolor: 0x000000, actionId: 'EXIT_VIDEO' }
    ]

    videoCommandPresets.forEach(p =>
        createPreset(p.id, 'VIDEO', p.name, p.text, p.color, p.bgcolor, p.actionId)
    )

    // ---------------------------------------------------
    // Presets de Exibição de Tempo e Slide
    // ---------------------------------------------------
    const displayPresets = [
        { id: 'hour', name: 'HOUR', text: '$(PPT_VIDEO:timer_hours)', bgcolor: 0x8a8a8a },
        { id: 'minute', name: 'MINUTE', text: '$(PPT_VIDEO:timer_minutes)', bgcolor: 0x8a8a8a },
        { id: 'second', name: 'SECOND', text: '$(PPT_VIDEO:timer_seconds)', bgcolor: 0x8a8a8a },
        { id: 'timer', name: 'TIMER', text: '$(PPT_VIDEO:timer)', bgcolor: 0x8a8a8a },
        { id: 'slide', name: 'SLIDE', text: '$(PPT_VIDEO:slide_info)', bgcolor: 0x8a8a8a },
        { id: 'remaining', name: 'SLIDE REMAINING', text: '$(PPT_VIDEO:remaining_slide_info)', bgcolor: 0x8a8a8a }
    ];

    displayPresets.forEach((p) => {
        // SLIDE e REMAINING com fonte 16, o resto 20
        const size = (p.id === 'slide' || p.id === 'remaining') ? 16 : 20

        createPreset(p.id, 'Display', p.name, p.text, 0xffffff, p.bgcolor, undefined, size)
    })

    displayPresets.forEach(p => {
        const key = `preset_${p.id}`
        if (presets[key]) {
            presets[key].feedbacks = presets[key].feedbacks || []
            presets[key].feedbacks.unshift({
                feedbackId: 'default_display',
                style: { bgcolor: 0x8a8a8a, color: 0xffffff }
            })
        }
    })

    // ---------------------------------------------------
    // APLICAR FEEDBACKS NO TIMER (com cores automáticas)
    // ---------------------------------------------------
    function applyTimerFeedback(id) {
        const presetKey = `preset_${id}`
        const p = presets[presetKey]
        if (!p) return

        p.feedbacks = [
            { feedbackId: 'timer_green', style: { bgcolor: 0x00ff00, color: 0x000000 } },
            { feedbackId: 'timer_yellow', style: { bgcolor: 0xffff00, color: 0x000000 } },
            { feedbackId: 'timer_red', style: { bgcolor: 0xff0000, color: 0xffffff } },
        ]
    }

    applyTimerFeedback('hour')
    applyTimerFeedback('minute')
    applyTimerFeedback('second')
    applyTimerFeedback('timer')

    // ---------------------------------------------------
    // APLICAR FEEDBACKS NO SLIDE (cores automáticas)
    // ---------------------------------------------------
    const slidePreset = presets['preset_slide']
    if (slidePreset) {
        slidePreset.feedbacks = [
            { feedbackId: 'slide_green', style: { bgcolor: 0x00ff00, color: 0x000000 } },
            { feedbackId: 'slide_yellow', style: { bgcolor: 0xffff00, color: 0x000000 } },
            { feedbackId: 'slide_red', style: { bgcolor: 0xff0000, color: 0xffffff } },
        ]
    }

    // ---------------------------------------------------
    // APLICAR FEEDBACKS NOS BOTÕES DE SLIDE E REMAINING
    // ---------------------------------------------------
    const slideButtonPreset = presets['preset_slide']

    if (slideButtonPreset) {
        slideButtonPreset.feedbacks = [
            { feedbackId: 'slide_green', style: { bgcolor: 0x00ff00, color: 0x000000 } },
            { feedbackId: 'slide_yellow', style: { bgcolor: 0xffff00, color: 0x000000 } },
            { feedbackId: 'slide_red', style: { bgcolor: 0xff0000, color: 0xffffff } },
        ]
    }

    const remainingButtonPreset = presets['preset_remaining']

    if (remainingButtonPreset) {
        remainingButtonPreset.feedbacks = [

            { feedbackId: 'slide_green', style: { bgcolor: 0x00ff00, color: 0x000000 } },
            { feedbackId: 'slide_yellow', style: { bgcolor: 0xffff00, color: 0x000000 } },
            { feedbackId: 'slide_red', style: { bgcolor: 0xff0000, color: 0xffffff } },
        ]
    }



    // ---------------------------------------------------
    // PRESETS PPT 01–40 com fundo azul
    // ---------------------------------------------------
    function addPPTPreset(i) {
        const id = i < 10 ? `0${i}` : `${i}`
        createPreset(
            `ppt${id}`,
            'PPT',
            `Send PPT ${id} Command`,
            `PPT\n${id}`,
            0xffffff,
            0x0000ff, // Azul
            `PPT${id}`
        )
    }

    for (let i = 1; i <= 40; i++) addPPTPreset(i)

    // ---------------------------------------------------
    // PRESETS VIDEO 01–20
    // ---------------------------------------------------
    function addVideoPreset(i) {
        const id = i < 10 ? `0${i}` : `${i}`
        createPreset(
            `video${id}`,
            'VIDEO',
            `Send VIDEO ${id} Command`,
            `VIDEO\n${id}`,
            0xffffff,
            0x006400,
            `VIDEO${id}`
        )
    }

    for (let i = 1; i <= 20; i++) addVideoPreset(i)

    return presets
}
