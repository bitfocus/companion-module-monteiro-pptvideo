export function getActionDefinitions(self) {

	const actions = {}

	const createSimpleCommandAction = (name, command) => ({
		name: `${name}`,
		options: [],
		callback: async () => {
			const cmd = command
			const sendBuf = Buffer.from(cmd, 'latin1')
			self.socket.send(sendBuf)
		},
	})

	const simpleCommands = {
		ESC: 'esc',
		NEXT: 'next',
		PREVIOUS: 'previous',
		EXIT_PPT: 'pptexit',
		EXIT_VIDEO: 'videoexit',
	}

	for (let i = 1; i <= 20; i++) {
		const pptCommand = `PPT${i.toString().padStart(2, '0')}`;
		simpleCommands[pptCommand] = pptCommand.toLowerCase();
	}

	for (let i = 1; i <= 10; i++) {
		const videoCommand = `VIDEO${i.toString().padStart(2, '0')}`;
		simpleCommands[videoCommand] = videoCommand.toLowerCase();
	}

	for (const [name, command] of Object.entries(simpleCommands)) {
		actions[name] = createSimpleCommandAction(name, command)
	}

	return actions
}
