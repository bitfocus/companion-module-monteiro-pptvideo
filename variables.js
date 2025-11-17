export function getVariableDefinitions() {
	// Variáveis fixas (já existiam)
	const defs = [
		{ name: 'Timer', variableId: 'timer' },
		{ name: 'Timer Hours', variableId: 'timer_hours' },
		{ name: 'Timer Minutes', variableId: 'timer_minutes' },
		{ name: 'Timer Seconds', variableId: 'timer_seconds' },
		{ name: 'Slide Info', variableId: 'slide_info' },
		{ name: 'Remaining Slide Info', variableId: 'remaining_slide_info' },
		{ name: 'Freeze State', variableId: 'freeze_state' },

	]

	// Variáveis para nomes de PPT (01–40)
	for (let i = 1; i <= 40; i++) {
		const id = String(i).padStart(2, '0')
		defs.push({
			name: `PPT Nome ${id}`,
			variableId: `ppt_name_${id}`,
		})
	}

	// Variáveis para nomes de Vídeos (01–20)
	for (let i = 1; i <= 20; i++) {
		const id = String(i).padStart(2, '0')
		defs.push({
			name: `Video Nome ${id}`,
			variableId: `video_name_${id}`,
		})
	}

	return defs
}
