export function getPresetDefinitions() {
	const presets = {
		preset_esc: {
			type: 'button',
			category: 'PPT',
			name: 'Send ESC Command',
			style: {
				text: 'ESC',
				size: '18',
				color: '16777215',
				bgcolor: '0',
				show_topbar: false
			},
			steps: [
				{
					down: [
						{
							actionId: 'ESC',
						},
					],
					up: [],
				},
			],
		},
		preset_next: {
			type: 'button',
			category: 'PPT',
			name: 'Send NEXT Command',
			style: {
				text: '>\nNext',
				size: '14',
				color: '16777215',
				bgcolor: '25600',
				show_topbar: false
			},
			steps: [
				{
					down: [
						{
							actionId: 'NEXT',
						},
					],
					up: [],
				},
			],
		},
		preset_previous: {
			type: 'button',
			category: 'PPT',
			name: 'Send PREVIOUS Command',
			style: {
				text: '<\nPrevious',
				size: '14',
				color: '16777215',
				bgcolor: '9109504',
				show_topbar: false
			},
			steps: [
				{
					down: [
						{
							actionId: 'PREVIOUS',
						},
					],
					up: [],
				},
			],
		},
		preset_fechar_ppt: {
			type: 'button',
			category: 'PPT',
			name: 'Send FECHAR_PPT Command',
			style: {
				text: 'PPT\nEXIT',
				size: '18',
				color: '16777215',
				bgcolor: '0',
				show_topbar: false
			},
			steps: [
				{
					down: [
						{
							actionId: 'EXIT_PPT',
						},
					],
					up: [],
				},
			],
		},
		preset_fechar_video: {
			type: 'button',
			category: 'VIDEO',
			name: 'Send FECHAR_VIDEO Command',
			style: {
				text: 'VIDEO EXIT',
				size: '18',
				color: '16777215',
				bgcolor: '0',
				show_topbar: false
			},
			steps: [
				{
					down: [
						{
							actionId: 'EXIT_VIDEO',
						},
					],
					up: [],
				},
			],
		}
	}

	for (let i = 1; i <= 20; i++) {
		const pptCommand = i < 10 ? `PPT\n0${i}` : `PPT\n${i}`;
		const pptText = i < 10 ? `ppt0${i}` : `ppt${i}`;
		presets[`preset_${pptCommand}`] = {
			type: 'button',
			category: 'PPT',
			name: `Send ${pptCommand.toUpperCase()} Command`,
			style: {
				text: pptCommand.toUpperCase(),
				size: '18',
				color: '16777215',
				bgcolor: '139',
				show_topbar: false
			},
			steps: [
				{
					down: [
						{
							actionId: pptText.toUpperCase(),
						},
					],
					up: [],
				},
			],
		};
	}

	for (let i = 1; i <= 10; i++) {
		const videoCommand = i < 10 ? `VIDEO\n0${i}` : `VIDEO\n${i}`;
		const videoText = i < 10 ? `video0${i}` : `video${i}`;
		presets[`preset_${videoCommand}`] = {
			type: 'button',
			category: 'VIDEO',
			name: `Send ${videoCommand.toUpperCase()} Command`,
			style: {
				text: videoCommand.toUpperCase(),
				size: '18',
				color: '16777215',
				bgcolor: '25600',
				show_topbar: false
			},
			steps: [
				{
					down: [
						{
							actionId: videoText.toUpperCase(),
						},
					],
					up: [],
				},
			],
		};
	}

	return presets;
}
