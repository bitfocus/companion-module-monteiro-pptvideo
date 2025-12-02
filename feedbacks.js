export function getFeedbackDefinitions(self) {

	// -----------------------------------------
	// Function to interpret slide_info
	// -----------------------------------------
	function parseSlideInfo() {
		let raw = String(self.getVariableValue('slide_info') || '')

		if (raw.toLowerCase().includes('fechado')) { // "fechado" = "closed"
			return { current: null, total: null, remaining: null, closed: true }
		}

		raw = raw.replace(/Slide/i, '')
			.replace(/\n/g, '')
			.trim()

		const parts = raw.split('/').map(p => parseInt(p.trim()))

		if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
			return { current: null, total: null, remaining: null, closed: false }
		}

		const current = parts[0]
		const total = parts[1]
		let remaining = total - current
		if (remaining < 0) remaining = 0

		return { current, total, remaining, closed: false }
	}

	return {

		// -------------------------------------------------
		// TIMER FEEDBACKS
		// -------------------------------------------------

		timer_green: {
			type: 'boolean',
			callback: () => {
				const min = parseInt(self.getVariableValue('timer_minutes') || 0)
				const sec = parseInt(self.getVariableValue('timer_seconds') || 0)
				const total = min * 60 + sec
				return total > 60
			},
			style: { bgcolor: 0x00ff00, color: 0x000000 },
		},

		timer_yellow: {
			type: 'boolean',
			callback: () => {
				const min = parseInt(self.getVariableValue('timer_minutes') || 0)
				const sec = parseInt(self.getVariableValue('timer_seconds') || 0)
				const total = min * 60 + sec
				return total <= 60 && total > 30
			},
			style: { bgcolor: 0xffff00, color: 0x000000 },
		},

		timer_red: {
			type: 'boolean',
			callback: () => {
				const min = parseInt(self.getVariableValue('timer_minutes') || 0)
				const sec = parseInt(self.getVariableValue('timer_seconds') || 0)
				const total = min * 60 + sec
				return total <= 30
			},
			style: { bgcolor: 0xff0000, color: 0xffffff },
		},

		// -------------------------------------------------
		// SLIDE FEEDBACKS
		// -------------------------------------------------
		slide_green: {
			type: 'boolean',
			callback: () => {
				const { remaining, closed } = parseSlideInfo()
				return !closed && remaining !== null && remaining > 10
			},
			style: { bgcolor: 0x00ff00, color: 0x000000 },
		},

		slide_yellow: {
			type: 'boolean',
			callback: () => {
				const { remaining, closed } = parseSlideInfo()
				return !closed && remaining !== null && remaining <= 10 && remaining > 3
			},
			style: { bgcolor: 0xffff00, color: 0x000000 },
		},

		slide_red: {
			type: 'boolean',
			callback: () => {
				const { remaining, closed } = parseSlideInfo()
				return !closed && remaining !== null && remaining <= 3
			},
			style: { bgcolor: 0xff0000, color: 0xffffff },
		},


		// -------------------------------------------------
        // FEEDBACK FOR "FREEZE" STATE
        // -------------------------------------------------
        freeze_state: {
			type: 'boolean',
			callback: () => {
				const freezeState = String(self.getVariableValue('freeze_state') || '').toLowerCase()
				return freezeState === 'freeze'
			},
			style: {
				bgcolor: 0x3EE6DB, // Blue
				color: 0xffffff,   // White text
			},
		},

		// -------------------------------------------------
		// FEEDBACK FOR "UNFREEZE" STATE
		// -------------------------------------------------
		unfreeze_state: {
			type: 'boolean',
			callback: () => {
				const freezeState = String(self.getVariableValue('freeze_state') || '').toLowerCase()
				return freezeState === 'unfreeze'
			},
			style: {
				bgcolor: 0xff0000, // Red
				color: 0xffffff,   // White text
			},
		},

		file_active: {
			type: 'boolean',
			options: [
				{
					type: 'textinput',
					id: 'id',
					label: 'File ID (pptXX or videoXX)',
					default: ''
				}
			],
			callback: (feedback) => {
				const active = String(self.getVariableValue('active_file') || '').toLowerCase()
				const id = String(feedback.options.id || '').toLowerCase()
				return active === id
			},
			style: {
				// this style will be overridden by specific presets (below)
			}
		},

		next_file_active: {
			type: 'boolean',
			options: [
				{
					type: 'textinput',
					id: 'id',
					label: 'File ID (pptXX or videoXX)',
					default: '',
				},
			],
			callback: (feedback) => {
				const next = String(self.getVariableValue('next_file') || '').toLowerCase()
				const id = String(feedback.options.id || '').toLowerCase()
				return next === id
			},
			style: {
				bgcolor: 0xff0000, // red
				color: 0xffffff,
			},
		},


	}
}
