import { io } from 'socket.io-client';

export default class UltraCasat {
    constructor({
        //Required
        clientKey,
        tvUUID,

        //Optional Parameters
        fastForwardRewindTime, //10 as default

        //Events
        onConnect,
        onPlay,
        onPause,
        onProgress,
        onSeek,
        onDuration,
        onLoadedData,
        onCanPlay,
        onPlayerVisibilityChanged,
        onClientDisconnect,
    }) {
        if ( ! clientKey ) throw new Error('clientKey is required');
        if ( ! tvUUID ) throw new Error('tvUUID is required');

        this.clientKey = clientKey;
        this.tvUUID = tvUUID;

        if ( onConnect ) this.onConnect = onConnect;
        if ( onPlay ) this.onPlay = onPlay;
        if ( onPause ) this.onPause = onPause;
        if ( onProgress ) this.onProgress = onProgress;
        if ( onSeek ) this.onSeek = onSeek;
        if ( onDuration ) this.onDuration = onDuration;
        if ( onLoadedData ) this.onLoadedData = onLoadedData;
        if ( onCanPlay ) this.onCanPlay = onCanPlay;
        if ( onClientDisconnect ) this.onClientDisconnect = onClientDisconnect;
        if ( onPlayerVisibilityChanged ) this.onPlayerVisibilityChanged = onPlayerVisibilityChanged;

        this.fastForwardRewindTime = ! fastForwardRewindTime || parseInt(fastForwardRewindTime) <= 0 ? 10 : parseInt(fastForwardRewindTime);
    }

    connect(tvUUID){
        if ( tvUUID !== undefined ){
            this.tvUUID = tvUUID;
        }

        this.socket = io('https://socket.ultracast.app', {
            query: {
                clientKey: this.clientKey,
                tvUUID: this.tvUUID
            }
        });

        this.socket.on('connect', () => {
            this.connected = true;
            if ( this.onConnect ) this.onConnect(this);

            if ( this.onPlay )
                this.socket.on('play', () => this.onPlay(this));

            if ( this.onPause )
                this.socket.on('pause', () => this.onPause(this));

            if ( this.onDuration )
                this.socket.on('duration', ( args ) => this.onDuration(this, args));

            if ( this.onProgress )
                this.socket.on('progress', ( args ) => this.onProgress(this, args));

            if ( this.onSeek )
                this.socket.on('seek', ( args ) => this.onSeek(this, args));

            if ( this.onClientDisconnect )
                this.socket.on('disconnected', ( args ) => this.onClientDisconnect(this, args))

            if ( this.onLoadedData )
                this.socket.on('loadeddata', ( args ) => this.onLoadedData(this, args));

            if ( this.onPlayerVisibilityChanged )
                this.socket.on('playerVisibility', ( args ) => this.onPlayerVisibilityChanged(this, args));

            if ( this.onCanPlay )
                this.socket.on('canplay', ( args ) => this.onCanPlay(this, args))

            this.socket.prependAny( this.setListeners );

            this.socket.on('disconnect', () => {
                this.socket.removeAllListeners();
            })
        });
    }


    //Private listeners
    setListeners(eventName, args){
        switch(eventName){
            case 'play':
                this.state = 'played';
                break;
            case 'pause':
                this.state = 'paused';
                break;
            case 'progress':
            case 'seek':
                this.time = args.time;
                break;
            case 'duration':
                this.fullDuration = args.duration;
                break;
        }
    }

    //Getters
    get isConnected(){
        return this.connected;
    }

    get currentState(){
        return this.state;
    }

    get currentTime(){
        return this.time;
    }

    get duration(){
        return this.fullDuration;
    }

    //Public functions

    disconnect(){
        if ( ! this.connected ) throw new Error('You are not connected');
        this.socket.disconnect();
    }

    play(){
        if ( ! this.connected ) throw new Error('You are not connected');
        console.log('play emit', this.socket.emit('play'));
    }

    pause(){
        if ( ! this.connected ) throw new Error('You are not connected');
        this.socket.emit('pause');
    }

    forward(){
        if ( ! this.connected ) throw new Error('You are not connected');
        this.socket.emit('forward', { speed: this.fastForwardRewindTime });
    }

    backward(){
        if ( ! this.connected ) throw new Error('You are not connected');
        this.socket.emit('backward', { speed: this.fastForwardRewindTime });
    }

    seek(time){
        if ( ! this.connected ) throw new Error('You are not connected');
        this.socket.emit('seek', { time });
    }

    setPlayer(information){
        if ( ! this.connected ) throw new Error('You are not connected');
        if ( ! information.source.src ) throw new Error('You need to set up a source.src');
        if ( ! information.source.type ) throw new Error('You need to set up a source.type');

        information.fastForwardRewindTime = this.fastForwardRewindTime;

        this.socket.emit('setPlayer', information);
    }


}