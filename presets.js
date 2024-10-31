export function getPresetDefinitions() {
    const presets = {};

    // Função para criar presets básicos com texto e ação customizados
    function createPreset(id, category, name, text, color, bgcolor, actionId, size = '18') {
        presets[`preset_${id}`] = {
            type: 'button',
            category,
            name,
            style: {
                text,
                size,
                color,
                bgcolor,
                show_topbar: false,
            },
            steps: [
                {
                    down: actionId ? [{ actionId }] : [],
                    up: []
                },
            ],
        };
    }

    // Presets básicos de comando ESC, NEXT, PREVIOUS, EXIT_PPT, EXIT_VIDEO
    const commandPresets = [
        { id: 'esc', name: 'Send ESC Command', text: 'ESC', color: '16777215', bgcolor: '0', actionId: 'ESC' },
        { id: 'next', name: 'Send NEXT Command', text: '>\nNext', color: '16777215', bgcolor: '25600', actionId: 'NEXT' },
        { id: 'previous', name: 'Send PREVIOUS Command', text: '<\nPrevious', color: '16777215', bgcolor: '9109504', actionId: 'PREVIOUS' },
        { id: 'exit_ppt', name: 'Send exit PPT Command', text: 'PPT\nEXIT', color: '16777215', bgcolor: '0', actionId: 'EXIT_PPT' },
        { id: 'exit_video', name: 'Send exit VIDEO Command', text: 'VIDEO EXIT', color: '16777215', bgcolor: '0', actionId: 'EXIT_VIDEO' }
    ];
    commandPresets.forEach(({ id, name, text, color, bgcolor, actionId }) =>
        createPreset(id, 'PPT', name, text, color, bgcolor, actionId)
    );

    // Presets de exibição de tempo (HOUR, MINUTE, SECOND, TIMER, SLIDE)
    const displayPresets = [
        { id: 'hour', name: 'HOUR', text: '$(PPT_VIDEO:timer_hours)', bgcolor: '9109504' },
        { id: 'minute', name: 'MINUTE', text: '$(PPT_VIDEO:timer_minutes)', bgcolor: '9109504' },
        { id: 'second', name: 'SECOND', text: '$(PPT_VIDEO:timer_seconds)', bgcolor: '9109504' },
        { id: 'timer', name: 'TIMER', text: '$(PPT_VIDEO:timer)', bgcolor: '9109504' },
        { id: 'slide', name: 'SLIDE', text: '$(PPT_VIDEO:slide_info)', bgcolor: '9109504' }
    ];
    displayPresets.forEach(({ id, name, text, bgcolor }) =>
        createPreset(id, 'Display', name, text, '16777215', bgcolor)
    );
   // Função para adicionar presets PPT de 1 a 20
function addPPTPreset(i) {
    const id = i < 10 ? `0${i}` : `${i}`;
    createPreset(
        `ppt${id}`,
        'PPT',
        `Send PPT ${id} Command`,
        `PPT\n${id}`,
        '16777215',
        '139',
        `PPT${id}`
    );
}
// Itera de 1 a 20 e chama a função addPPTPreset para cada valor
for (let i = 1; i <= 20; i++) {
    addPPTPreset(i);
}
   // Função para adicionar presets VIDEO de 1 a 10
function addVideoPreset(i) {
    const id = i < 10 ? `0${i}` : `${i}`;
    createPreset(
        `video${id}`,
        'VIDEO',
        `Send VIDEO ${id} Command`,
        `VIDEO\n${id}`,
        '16777215',
        '25600',
        `VIDEO${id}`
    );
}
// Itera de 1 a 10 e chama a função addVideoPreset para cada valor
for (let i = 1; i <= 10; i++) {
    addVideoPreset(i);
}

    return presets;
}
