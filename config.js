import { Regex } from '@companion-module/base'

const REGEX_IP_OR_HOST =
	'/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})$|^((([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9]))$/'

export const ConfigFields = [

	{
		type: 'static-text',
		id: 'info',
		label: 'Information', 
		width: 12,
		value: 'I put the download link in the Help folder, but for information purposes. This module consists of enabling PowerPoint and video control through buttons. Facilitating the manipulation of more than one presentation, you can control it on more than one computer using the software and the companion, being able to open, close, advance and other functions on more than one computer simultaneously.'
	},
	{
		type: 'textinput',
		id: 'host',
		label: 'Target Host name or IP',
		default: '127.0.0.1',
		width: 8,
		regex: REGEX_IP_OR_HOST,
	},
	{
		type: 'textinput',
		id: 'port',
		label: 'Target Port',
		default: '7800',
		width: 4,
		regex: Regex.PORT,
	},



]
