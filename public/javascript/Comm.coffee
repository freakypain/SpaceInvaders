class Msock
	constructor: (@url, @options) ->
		@connected = false
		$.growl('Connecting...');
		@keepConnexion()
	keepConnexion: ->
		# connection socket.io
		that = @
		@socket = io.connect(@url, @options);
		@socket.on('connecting', (type) ->
			$.growl('With ['+type+']...')
			that.type = type
		)
		@socket.on('connect', ->
			that.connected = true
			$.growl('Connected')
		)
		@socket.on('connect_failed', ->
			$.growl('Connection failed, please check your internet connection')
		)
		wc = @
		@socket.on('disconnect', ->
			that.connected = false
			wc.displayError 'You are disconnected !<br/>Reconnection...'
		)
	emit:	(event, hash) ->
		if (@connected)
			@socket.emit(event, hash)
		else
			@displayError ('You\'re not connected, please wait...')
	on:	(event, f) ->
		@socket.on(event, f)
	displayError: (mess) -> $.growl(mess)
