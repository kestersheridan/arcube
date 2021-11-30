


//text to speech

TextToSpeech = function(item, parentside) {
	var _this = this;
	this.UID = null;
	this.userData = null;
	this.parentSide = parentside;
	this.speechText = "";
	this.voice = null;
	this.voiceAudioQuality = 2;
	this.voiceStartState = null;
	this.voiceStartCallback = null;
	this.voiceStartCallbackPresent = false;
	this.voiceEndState = null;
	this.voiceEndCallback = null;
	this.voiceEndCallbackPresent = false;
	this.voiceErrorCallback = null;
	this.pitch = null;
	this.rate = null;
	this.player = null;
	this.synthesizer = undefined;
	this.speechCurrentStatus = MediaPlayStateEnum.NOTINITIALISED;
	this.storedSpeechStatus = MediaPlayStateEnum.NOTINITIALISED;
	
	if (item.hasOwnProperty('uid'))
	{
		this.UID = item.uid;
		this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.TEXTTOSPEECH);
	}
	
	if (item.hasOwnProperty('userdata'))
	{
		this.userData = item.userdata;
	}
	
	if (item.hasOwnProperty('text'))
	{
		this.speechText = item.text;
	}
	
	
	
	if (!g_isIOS)
	{
		if (item.hasOwnProperty('android'))
		{
			if (item.android.hasOwnProperty('pitch'))
			{
				this.pitch = item.android.pitch;
				if (!(isNaN(item.android.pitch)))
				{
					if ((item.android.pitch >= 0) && (item.android.pitch <= 2))
					{
						this.pitch = item.android.pitch;
					}
				}
			}
			
			if (item.android.hasOwnProperty('rate'))
			{
				this.rate = item.android.rate;
				if (!(isNaN(item.android.rate)))
				{
					if ((item.android.rate >= 0) && (item.android.rate <= 1.5))
					{
						this.rate = item.android.rate;
					}
				}
			}
			
			if (item.android.hasOwnProperty('voice'))
			{
				const result = responsiveVoice.getVoices().find( ({ name }) => name === item.android.voice );
				if (result === undefined)
				{
					this.voice = "UK English Male";
				}
				else
				{
					console.log("found voice " + result);
					this.voice = item.android.voice;
				}
			}
		}
	}
	else
	{
		
		var voicename, voicelang; 
		if (item.hasOwnProperty('ios'))
		{
			if (item.ios.hasOwnProperty('voice'))
			{
				voicename = item.ios.voice;
			}
			if (item.ios.hasOwnProperty('lang'))
			{
				voicelang = item.ios.lang;	
			}
			if (item.ios.hasOwnProperty('quality'))
			{
				this.voiceAudioQuality = item.ios.quality;
			}
		}
		if ((voicename == undefined) && (voicelang == undefined))
		{
			if (g_azureVoiceNames.length > 0)
			{
				this.voice = g_azureVoiceNames[0]; 
			}
		}
 		else
		{
			if (g_azureVoiceNames.length > 0)
			{
				for (var i = 0; i < g_azureVoiceNames.length; i++)
				{
					var result = true;
					var name = g_azureVoiceNames[i];
					if (voicename != undefined)
					{
						if (name.search(voicename) < 0) { result = false;}
					}
					if (voicelang != undefined)
					{
						if (name.search(voicelang) < 0) { result = false;}
					}
					if (result)
					{
						this.voice = g_azureVoiceNames[i];
						break;
					}
				}
				
			}
		}
		if (this.voice == null)
		{
			if (g_azureVoiceNames.length > 0)
			{
				this.voice = g_azureVoiceNames[0]; 
			}		
		}
		console.log("voice name " + this.voice);
	}
	
	
	this.voiceStartCallback = function() {
		if (_this.voiceStartCallbackPresent)
		{
			_this.voiceStartState.setActive();
		}
		_this.speechCurrentStatus = MediaPlayStateEnum.PLAYING;
	}
	
	this.voiceEndCallback = function() {
		if (_this.voiceEndCallbackPresent)
		{
			_this.voiceEndState.setActive();
		}
		_this.speechCurrentStatus = MediaPlayStateEnum.ENDED;
	}
	
	this.voiceErrorCallback = function() {
		if (_this.voiceEndCallbackPresent)
		{
			_this.voiceEndState.setActive();
		}
		_this.speechCurrentStatus = MediaPlayStateEnum.ERROR;
	}
	
}

TextToSpeech.prototype.constructor = TextToSpeech;


TextToSpeech.prototype.getType = function(){
	return ObjectTypeEnum.TEXTTOSPEECH;
}

TextToSpeech.prototype.getUID = function(){	
	return this.UID;
}

TextToSpeech.prototype.getUserData = function(){	
	return this.userData
}

TextToSpeech.prototype.InitialisePlayback = function(){
	var _this = this;
	if (this.player == null)
	{
		var speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(g_authorizationToken, g_serviceRegion);
		speechConfig.speechSynthesisVoiceName = this.voice;
		switch (this.voiceAudioQuality) {
		case 1:
			speechConfig.speechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
			break;
		case 2:
			speechConfig.speechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Audio16Khz64KBitRateMonoMp3;
			break;
		case 3:
			speechConfig.speechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;
			break;
		case 4:
			speechConfig.speechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3;
			break;
		case 5:
			speechConfig.speechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Audio24Khz96KBitRateMonoMp3;
			break;	
		case 6:
			speechConfig.speechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3;
			break;	
		default:
			speechConfig.speechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Audio16Khz64KBitRateMonoMp3;
			break;
		}
		this.player = new SpeechSDK.SpeakerAudioDestination();
		
		var audioConfig = SpeechSDK.AudioConfig.fromSpeakerOutput(this.player);

		this.synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);
		
		this.synthesizer.synthesisStarted = function (s, e) {
			console.log("synthesis started");
			if (_this.voiceStartCallbackPresent)
			{
				_this.voiceStartState.setActive();
			}
			_this.speechCurrentStatus = MediaPlayStateEnum.PLAYING;
		};
		
		this.synthesizer.synthesisCompleted = function (s, e) {
			console.log("synthesisCompleted");
			
		};
		
		this.synthesizer.SynthesisCanceled = function (s, e) {
			console.log("SynthesisCanceled");
		};
		
		
	}
	
	/* this.synthesizer.speakTextAsync("hello, this a test",
			  complete_cb,
			  err_cb);   */
}

TextToSpeech.prototype.speak = function(value = true, inputuid = null, voicestartstateuid = null, voiceendstateuid = null){
	var _this = this;
	this.voiceStartState = null;
	this.voiceStartCallbackPresent = false;
	if (voicestartstateuid != null)
	{
		this.voiceStartState = this.parentSide.getUIDObjectMap(voicestartstateuid, ObjectTypeEnum.STATE);
		if (this.voiceStartState != null)
		{
			this.voiceStartCallbackPresent = true;
		}
	}
	this.voiceEndState = null;
	this.voiceEndCallbackPresent = false;
	if (voiceendstateuid != null)
	{
		this.voiceEndState = this.parentSide.getUIDObjectMap(voiceendstateuid, ObjectTypeEnum.STATE);
		if (this.voiceEndState != null)
		{
			this.voiceEndCallbackPresent = true;
		}
	}
	var spokentext = "";
	if (inputuid != null)
	{
		var dialogEngine = this.parentSide.getUIDObjectMap(inputuid, ObjectTypeEnum.DIALOGENGINE);
		if (dialogEngine != null)
		{
			spokentext = dialogEngine.getDialogResponseText();
		}
	}
	else
	{
		(value == true) ? spokentext = this.speechText : spokentext = value;
	}
	
	if (!g_isIOS)
	{
		if ((this.pitch != null) && (this.rate != null))
		{			
			responsiveVoice.speak(spokentext, this.voice, {pitch : this.pitch, rate : this.rate, onstart: this.voiceStartCallback, onend: this.voiceEndCallback, onerror: this.voiceErrorCallback});
		}
		else if ((this.pitch == null) && (this.rate != null))
		{
			responsiveVoice.speak(spokentext, this.voice, {rate : this.rate, onstart: this.voiceStartCallback, onend: this.voiceEndCallback, onerror: this.voiceErrorCallback});
		}
		else if ((this.pitch != null) && (this.rate == null))
		{
			responsiveVoice.speak(spokentext, this.voice, {pitch : this.pitch, onstart: this.voiceStartCallback, onend: this.voiceEndCallback, onerror: this.voiceErrorCallback});
		}
		else if ((this.pitch == null) && (this.rate == null))
		{
			responsiveVoice.speak(spokentext, this.voice, {onstart: this.voiceStartCallback, onend: this.voiceEndCallback, onerror: this.voiceErrorCallback});
		}
	}
	else
	{
		
		this.player.onAudioEnd = function (_) {
			console.log("onAudioEnd");
			if (_this.voiceEndCallbackPresent)
			{
				_this.voiceEndState.setActive();
			}
			_this.speechCurrentStatus = MediaPlayStateEnum.ENDED;
			_this.player = null;
		};
		
		const complete_callback = function (result) {
			console.log("complete_cb " + result);
			
			_this.synthesizer.close();
			_this.synthesizer = undefined;
			
		};
		const err_callback = function (err) {
			console.log("err_cb " + err);
			if (_this.voiceEndCallbackPresent)
			{
				_this.voiceEndState.setActive();
			}
			_this.speechCurrentStatus = MediaPlayStateEnum.ERROR;
			_this.synthesizer.close();
			_this.synthesizer = undefined;
			_this.player = null;
		};
		
		this.synthesizer.speakTextAsync(spokentext,
                  complete_callback,
                  err_callback);  
	}
		
	this.speechCurrentStatus = MediaPlayStateEnum.PLAYING;
}


TextToSpeech.prototype.cancel = function()
{
	this.voiceStartState = null;
	this.voiceStartCallbackPresent = false;
	this.voiceEndState = null;
	this.voiceEndCallbackPresent = false;
	if (!g_isIOS)
	{
		if(responsiveVoice.isPlaying())
		{
			responsiveVoice.cancel();
		}
	}
	else
	{
		if (this.player != null)
		{
			if (!this.player.isClosed)
			{
				this.player.close();
			}
			this.player = null;
		}
		if (this.synthesizer != undefined)
		{
			this.synthesizer.close();
			this.synthesizer = undefined;
		}
	}
}

TextToSpeech.prototype.deactivate = function(){
	
	this.storedSpeechStatus = this.speechCurrentStatus;
	if (this.speechCurrentStatus == MediaPlayStateEnum.PLAYING)
	{
		this.pause();
	}
}

TextToSpeech.prototype.reactivate = function(){
	
	if (this.storedSpeechStatus == MediaPlayStateEnum.PLAYING)
	{
		this.resume();
	}
}

TextToSpeech.prototype.pause = function()
{
	if (!g_isIOS)
	{
		if(responsiveVoice.isPlaying()) {
			responsiveVoice.pause();
		}
	}
	else
	{
		if (this.player != null)
		{
			this.player.pause();
		}

	}
}

TextToSpeech.prototype.resume = function()
{
	if (!g_isIOS)
	{
		responsiveVoice.resume();
	}
	else
	{
		if (this.player != null)
		{
			this.player.resume();
		}
	}
}

TextToSpeech.prototype.dispose = function(){
	if (!g_isIOS)
	{
		if(responsiveVoice.isPlaying())
		{
			responsiveVoice.cancel();
		}
	}
	else
	{
		if (this.player != null)
		{
			if (!this.player.isClosed)
			{
				this.player.close();
			}
			this.player = null;
		}
		if (this.synthesizer != undefined)
		{
			this.synthesizer.close();
			this.synthesizer = undefined;
		}
	}
	this.parentSide = null;
	this.UID = null;
	this.userData = null;
	this.speechText = null;
	this.voice = null;
	this.voiceEndState = null;
	this.voiceStartState = null;
	this.voiceStartCallback = null;
	this.voiceStartCallbackPresent = null;
	this.voiceEndState = null;
	this.voiceEndCallback = null;
	this.voiceEndCallbackPresent = null;
	this.voiceErrorCallback = null;


}

//speech to text



SpeechToText = function(item, parentside) {

	var _this = this;
	this.UID = null;
	this.parentSide = parentside;
	this.recognition = null;
	this.recognizedText = null;	
	this.recogniseStartState = null;
	this.recogniseOnResultState = null;
	this.recogniseOnErrorState = null;
	this.recogniseOnEndState = null;
	this.recogniseStartStatePresent = false;
	this.recogniseOnResultStatePresent = false;
	this.recogniseOnErrorStatePresent = false;
	this.recogniseOnEndStatePresent = false;
	this.recognizing = false;
	this.timer = null;
	this.audioRecorder = null
	this.currentListeningState = MediaPlayStateEnum.NOTINITIALISED;


	this.config = {};
 	this.audioCtx = null;
	var AudioContext = window.AudioContext || window.webkitAudioContext;
    var self = this;
    this.mediaStream = null;
    this.audioInput;
    this.jsAudioNode;
    this.bufferSize = 4096;
    this.sampleRate = 44100;
	this.numberOfAudioChannels = 2;
    this.leftChannel = [];
    this.rightChannel = [];
    this.recording = false;
    this.recordingLength = 0;
    this.isPaused = false;
    var isAudioProcessStarted = false;
	this.blob = null;
	this.wavFile = null;
	this.timeout = 30000;
	
	
	if (item.hasOwnProperty('uid'))
	{
		this.UID = item.uid;
		this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.SPEECHTOTEXT);
	}
	
	if (item.hasOwnProperty('userdata'))
	{
		this.userData = item.userdata;
	}
	
	if (item.hasOwnProperty('channels'))
	{
		this.numberOfAudioChannels = item.channels;
	}
	
	if (item.hasOwnProperty('buffersize'))
	{
		this.bufferSize = item.buffersize;
	}
	
	if (item.hasOwnProperty('samplerate'))
	{
		this.sampleRate = item.samplerate;
	}
	
	if (item.hasOwnProperty('timeout'))
	{
		this.timeout = item.timeout;
	}
	
	if (g_isSpeechToTextCompatibleDevice)
	{
		console.log("webkitSpeechRecognition compatible");
		this.recognition = new webkitSpeechRecognition();
		this.recognition.continuous = false;
		this.recognition.onspeechstart = function() {
			_this.recognizing = true;
			_this.recognizedText = null;
			_this.currentListeningState = MediaPlayStateEnum.RECORDING;
			if (_this.recogniseStartStatePresent)
			{
				console.log("this.recogniseStartState");
				_this.recogniseStartState.setActive();
			}
		}
		this.recognition.onresult = function(ev) {
			_this.recognizing = false;
			_this.recognizedText = ev["results"][0][0]["transcript"];
			_this.currentListeningState = MediaPlayStateEnum.ENDED;
			if (_this.recogniseOnResultStatePresent)
			{
				console.log("this.recogniseOnResultState");
				_this.recogniseOnResultState.setActive();
			}
			
			_this.recognition.stop();
		}
		this.recognition.onerror = function(ev) {
			_this.currentListeningState = MediaPlayStateEnum.ENDED;
			if (_this.recogniseOnErrorStatePresent)
			{
				console.log("this.recogniseOnErrorState");
				_this.recogniseOnErrorState.setActive();
			}
			_this.recognizing = false;
			_this.recognition.stop();
		}
		this.recognition.onend = function() {
			_this.currentListeningState = MediaPlayStateEnum.ENDED;
			if ((_this.recogniseOnEndStatePresent) && (_this.recognizing))
			{
				console.log("this.recogniseOnEndState");
				_this.recogniseOnEndState.setActive();
			}
			_this.recognizing = false;
			_this.recognition.stop();
		}
	}
	else
	{
		/* this.audioRecorder = new AudioRecorder();
		this.audioRecorder.initialise(null, this.fileURL ); */
	}
	
	//audio recording functions
	
 	this.stopRecording = function (callback) {

        // stop recording
        _this.recording = false;

        // to make sure onaudioprocess stops firing
        _this.audioInput.disconnect();
        _this.jsAudioNode.disconnect();
		//_this.audioInput.disconnect(_this.jsAudioNode);
		//_this.jsAudioNode.disconnect(_this.audioCtx.destination);

        mergeLeftRightBuffers({
            sampleRate: _this.sampleRate,
            numberOfAudioChannels: _this.numberOfAudioChannels,
            internalInterleavedLength: _this.recordingLength,
            leftBuffers: _this.leftChannel,
            rightBuffers: _this.numberOfAudioChannels === 1 ? [] : _this.rightChannel
        }, function(buffer, view) {

            self.blob = new Blob([view], {
                type: 'audio/wav'
            });

            self.buffer = new ArrayBuffer(view.buffer.byteLength);
            self.view = view;
            self.sampleRate = _this.sampleRate;
            self.bufferSize = _this.bufferSize;
            self.length = _this.recordingLength;

            callback && callback(self.blob);

            clearRecordedData();

            isAudioProcessStarted = false;
        });
    }

    function clearRecordedData() {
            _this.leftChannel = _this.rightChannel = [];
            _this.recordingLength = 0;
            isAudioProcessStarted = false;
            _this.recording = false;
            _this.isPaused = false;
    }

    this.setupStorage = function() {
        _this.audioCtx = new AudioContext();

        if (_this.audioCtx.createJavaScriptNode) {
            _this.jsAudioNode = _this.audioCtx.createJavaScriptNode(_this.bufferSize, _this.numberOfAudioChannels, _this.numberOfAudioChannels);
        } else if (_this.audioCtx.createScriptProcessor) {
            _this.jsAudioNode = _this.audioCtx.createScriptProcessor(_this.bufferSize, _this.numberOfAudioChannels, _this.numberOfAudioChannels);
        } else {
            throw 'WebAudio API has no support on this browser.';
        }

        _this.jsAudioNode.connect(_this.audioCtx.destination);
    }

    this.onMicrophoneCaptured = function(microphone) {
		
		console.log("onMicrophoneCaptured");
        _this.mediaStream = microphone;
		_this.recording = true;
        _this.audioInput = _this.audioCtx.createMediaStreamSource(microphone);
        _this.audioInput.connect(_this.jsAudioNode);

        _this.jsAudioNode.onaudioprocess = onAudioProcess;

        
    }

    this.onMicrophoneCaptureError = function () {
        console.log("There was an error accessing the microphone. You may need to allow the browser access");
    }

    function onAudioProcess(e) {

        if (_this.isPaused) {
            return;
        }

        if (isMediaStreamActive() === false) {
            if (!config.disableLogs) {
                console.log('MediaStream seems stopped.');
            }
        }

        if (!_this.recording) {
            return;
        }

        if (!isAudioProcessStarted) {
            isAudioProcessStarted = true;
            if (config.onAudioProcessStarted) {
                config.onAudioProcessStarted();
            }

            if (config.initCallback) {
                config.initCallback();
            }
        }

        var left = e.inputBuffer.getChannelData(0);

        // we clone the samples
        _this.leftChannel.push(new Float32Array(left));

        if (_this.numberOfAudioChannels === 2) {
            var right = e.inputBuffer.getChannelData(1);
            _this.rightChannel.push(new Float32Array(right));
        }

        _this.recordingLength += _this.bufferSize;

        // export raw PCM
        self.recordingLength = _this.recordingLength;
    }

    function isMediaStreamActive() {
        if (config.checkForInactiveTracks === false) {
            // always return "true"
            return true;
        }

        if ('active' in _this.mediaStream) {
            if (!_this.mediaStream.active) {
                return false;
            }
        } else if ('ended' in _this.mediaStream) { // old hack
            if (_this.mediaStream.ended) {
                return false;
            }
        }
        return true;
    }

    function mergeLeftRightBuffers(config, callback) {
        function mergeAudioBuffers(config, cb) {
            var numberOfAudioChannels = config.numberOfAudioChannels;

            // todo: "slice(0)" --- is it causes loop? Should be removed?
            var leftBuffers = config.leftBuffers.slice(0);
            var rightBuffers = config.rightBuffers.slice(0);
            var sampleRate = config.sampleRate;
            var internalInterleavedLength = config.internalInterleavedLength;
            var desiredSampRate = config.desiredSampRate;

            if (numberOfAudioChannels === 2) {
                leftBuffers = mergeBuffers(leftBuffers, internalInterleavedLength);
                rightBuffers = mergeBuffers(rightBuffers, internalInterleavedLength);
                if (desiredSampRate) {
                    leftBuffers = interpolateArray(leftBuffers, desiredSampRate, sampleRate);
                    rightBuffers = interpolateArray(rightBuffers, desiredSampRate, sampleRate);
                }
            }

            if (numberOfAudioChannels === 1) {
                leftBuffers = mergeBuffers(leftBuffers, internalInterleavedLength);
                if (desiredSampRate) {
                    leftBuffers = interpolateArray(leftBuffers, desiredSampRate, sampleRate);
                }
            }

            // set sample rate as desired sample rate
            if (desiredSampRate) {
                sampleRate = desiredSampRate;
            }

            // for changing the sampling rate, reference:
            // http://stackoverflow.com/a/28977136/552182
            function interpolateArray(data, newSampleRate, oldSampleRate) {
                var fitCount = Math.round(data.length * (newSampleRate / oldSampleRate));
                //var newData = new Array();
                var newData = [];
                //var springFactor = new Number((data.length - 1) / (fitCount - 1));
                var springFactor = Number((data.length - 1) / (fitCount - 1));
                newData[0] = data[0]; // for new allocation
                for (var i = 1; i < fitCount - 1; i++) {
                    var tmp = i * springFactor;
                    //var before = new Number(Math.floor(tmp)).toFixed();
                    //var after = new Number(Math.ceil(tmp)).toFixed();
                    var before = Number(Math.floor(tmp)).toFixed();
                    var after = Number(Math.ceil(tmp)).toFixed();
                    var atPoint = tmp - before;
                    newData[i] = linearInterpolate(data[before], data[after], atPoint);
                }
                newData[fitCount - 1] = data[data.length - 1]; // for new allocation
                return newData;
            }

            function linearInterpolate(before, after, atPoint) {
                return before + (after - before) * atPoint;
            }

            function mergeBuffers(channelBuffer, rLength) {
                var result = new Float64Array(rLength);
                var offset = 0;
                var lng = channelBuffer.length;

                for (var i = 0; i < lng; i++) {
                    var buffer = channelBuffer[i];
                    result.set(buffer, offset);
                    offset += buffer.length;
                }

                return result;
            }

            function interleave(leftChannel, rightChannel) {
                var length = leftChannel.length + rightChannel.length;

                var result = new Float64Array(length);

                var inputIndex = 0;

                for (var index = 0; index < length;) {
                    result[index++] = leftChannel[inputIndex];
                    result[index++] = rightChannel[inputIndex];
                    inputIndex++;
                }
                return result;
            }

            function writeUTFBytes(view, offset, string) {
                var lng = string.length;
                for (var i = 0; i < lng; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            }

            // interleave both channels together
            var interleaved;

            if (numberOfAudioChannels === 2) {
                interleaved = interleave(leftBuffers, rightBuffers);
            }

            if (numberOfAudioChannels === 1) {
                interleaved = leftBuffers;
            }

            var interleavedLength = interleaved.length;

            // create wav file
            var resultingBufferLength = 44 + interleavedLength * 2;

            var buffer = new ArrayBuffer(resultingBufferLength);

            var view = new DataView(buffer);

            // RIFF chunk descriptor/identifier
            writeUTFBytes(view, 0, 'RIFF');

            // RIFF chunk length
            view.setUint32(4, 44 + interleavedLength * 2, true);

            // RIFF type
            writeUTFBytes(view, 8, 'WAVE');

            // format chunk identifier
            // FMT sub-chunk
            writeUTFBytes(view, 12, 'fmt ');

            // format chunk length
            view.setUint32(16, 16, true);

            // sample format (raw)
            view.setUint16(20, 1, true);

            // stereo (2 channels)
            view.setUint16(22, numberOfAudioChannels, true);

            // sample rate
            view.setUint32(24, sampleRate, true);

            // byte rate (sample rate * block align)
            view.setUint32(28, sampleRate * 2, true);

            // block align (channel count * bytes per sample)
            view.setUint16(32, numberOfAudioChannels * 2, true);

            // bits per sample
            view.setUint16(34, 16, true);

            // data sub-chunk
            // data chunk identifier
            writeUTFBytes(view, 36, 'data');

            // data chunk length
            view.setUint32(40, interleavedLength * 2, true);

            // write the PCM samples
            var lng = interleavedLength;
            var index = 44;
            var volume = 1;
            for (var i = 0; i < lng; i++) {
                view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
                index += 2;
            }

            if (cb) {
                return cb({
                    buffer: buffer,
                    view: view
                });
            }

            postMessage({
                buffer: buffer,
                view: view
            });
        }

        var webWorker = processInWebWorker(mergeAudioBuffers);

        webWorker.onmessage = function(event) {
            callback(event.data.buffer, event.data.view);

            // release memory
            URL.revokeObjectURL(webWorker.workerURL);
        };

        webWorker.postMessage(config);
    }

    function processInWebWorker(_function) {
        var workerURL = URL.createObjectURL(new Blob([_function.toString(),
            ';this.onmessage =  function (e) {' + _function.name + '(e.data);}'
        ], {
            type: 'application/javascript'
        }));

        var worker = new Worker(workerURL);
        worker.workerURL = workerURL;
        return worker;
    } 
	
	
}

SpeechToText.prototype.constructor = SpeechToText;

SpeechToText.prototype.getType = function(){
	return ObjectTypeEnum.SPEECHTOTEXT;
}

SpeechToText.prototype.getUID = function(){	
	return this.UID;
}

SpeechToText.prototype.getUserData = function(){	
	return this.userData
}

SpeechToText.prototype.listen = function(recognisestartuid = null, recogniseonenduid = null, recogniseonresultuid = null, recogniseonerroruid = null){
	var _this = this;
	this.recogniseOnResultState = null;
	this.recogniseOnResultStatePresent = false;
	if (recogniseonresultuid != null)
	{
		this.recogniseOnResultState = this.parentSide.getUIDObjectMap(recogniseonresultuid, ObjectTypeEnum.STATE);
		if (this.recogniseOnResultState != null)
		{
			console.log("this.recogniseOnResultStatePresent");
			this.recogniseOnResultStatePresent = true;
		}
	}
	this.recogniseOnErrorState = null;
	this.recogniseOnErrorStatePresent = false;
	if (recogniseonerroruid != null)
	{
		this.recogniseOnErrorState = this.parentSide.getUIDObjectMap(recogniseonerroruid, ObjectTypeEnum.STATE);
		if (this.recogniseOnErrorState != null)
		{
			console.log("this.recogniseOnErrorStatePresent");
			this.recogniseOnErrorStatePresent = true;
		}
	}
	this.recogniseOnEndState = null;
	this.recogniseOnEndStatePresent = false;
	if (recogniseonenduid != null)
	{
		this.recogniseOnEndState = this.parentSide.getUIDObjectMap(recogniseonenduid, ObjectTypeEnum.STATE);
		if (this.recogniseOnEndState != null)
		{
			console.log("this.recogniseOnEndStatePresent");
			this.recogniseOnEndStatePresent = true;
		}
	}
	
	if (g_isSpeechToTextCompatibleDevice)
	{
		this.recogniseStartState = null;
		this.recogniseStartStatePresent = false;
		if (recognisestartuid != null)
		{
			this.recogniseStartState = this.parentSide.getUIDObjectMap(recognisestartuid, ObjectTypeEnum.STATE);
			if (this.recogniseStartState != null)
			{
				console.log("this.recogniseStartState");
				this.recogniseStartStatePresent = true;
			}
		}
		
		if (!this.recognizing)
		{
			console.log("this.recognition.start");
			
			this.recognition.start();
		}
	}
	else
	{
		if (this.currentListeningState != MediaPlayStateEnum.RECORDING)
		{
			window.clearTimeout(this.timer);
			this.timer = window.setTimeout(function() { if (this.recogniseOnEndStatePresent) this.recogniseOnEndState.setActive(); this.stopListening(true); }, this.timeout);
			this.currentListeningState = MediaPlayStateEnum.RECORDING;
			
			this.setupStorage();
			console.log("AudioRecorder start");
			navigator.mediaDevices.getUserMedia({audio: true})
				.then(this.onMicrophoneCaptured)
				.catch(this.onMicrophoneCaptureError);
			
		}
	}
}


SpeechToText.prototype.stopListening = function(process)
{
	var _this = this;
	window.clearTimeout(this.timer);
	if (this.currentListeningState == MediaPlayStateEnum.RECORDING)
	{
 		this.stopRecording(function(blob) {
			if (_this.audioCtx != null)
			{
				_this.audioCtx.close().then(function() {
					console.log("this.audioCtx closed"); 
					_this.audioInput = null;
					_this.jsAudioNode = null;
					_this.audioCtx = null;
				});
			}

			if (process)
			{
				let wavfile;
				let reader = new FileReader();
				reader.readAsArrayBuffer(blob);

				reader.onload = function() {
					wavfile = new File([reader.result], "speech.wav",{type:"audio/wav"});
					var speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(g_authorizationToken, g_serviceRegion);
					speechConfig.speechRecognitionLanguage = "en-US";
					var audioConfig  = SpeechSDK.AudioConfig.fromWavFileInput(wavfile);
					_this.recognition = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
					_this.recognition.recognizeOnceAsync(
						function (result) {
							console.log("result.text " + result.text);
							_this.recognition.close();
							_this.recognition = undefined;
							wavFile = null;
							if (result.text == undefined)
							{
								console.log("_this.recogniseOnEndStatePresent " + _this.recogniseOnEndStatePresent);
								if (_this.recogniseOnEndStatePresent)
								{
									console.log("this.recogniseOnEndState");
									_this.recogniseOnEndState.setActive();
								}
							}
							else
							{
								_this.recognizedText = result.text;
								console.log("_this.recogniseOnResultStatePresent " + _this.recogniseOnResultStatePresent);
								if (_this.recogniseOnResultStatePresent)
								{
									console.log("this.recogniseOnResultState " + _this.recogniseOnResultState);
									_this.recogniseOnResultState.setActive();
								}
							}
							
							//_this.blob = null;
							//blob = null;
							
						},
						function (err) {
							_this.recognition.close();
							_this.recognition = undefined;
							_this.wavFile = null;
							_this.currentListeningState = MediaPlayStateEnum.ENDED;
							console.log("this.recogniseOnErrorStatePresent " + _this.recogniseOnErrorStatePresent);
							if (_this.recogniseOnErrorStatePresent)
							{
								console.log("this.recogniseOnErrorState");
								_this.recogniseOnErrorState.setActive();
							}
							
							//_this.blob = null;
							//blob = null;
								
					});
				};

				reader.onerror = function() {
					_this.currentListeningState = MediaPlayStateEnum.ENDED;
					if (_this.recogniseOnErrorStatePresent)
					{
						console.log("this.recogniseOnErrorState");
						_this.recogniseOnErrorState.setActive();
					}
					console.log("this.recogniseOnErrorStatePresent " + _this.recogniseOnErrorStatePresent);
				};
				
			}
			
        });
		_this.currentListeningState = MediaPlayStateEnum.ENDED;		
	}
}



SpeechToText.prototype.abort = function()
{
	if (this.currentListeningState == MediaPlayStateEnum.RECORDING)
	{
		if (g_isSpeechToTextCompatibleDevice)
		{
			if (this.recognition != null)
			{
				this.recognition.abort();
			}
		}
		else
		{	
	
			this.stopListening(false);
			if (this.audioCtx != null)
			{
				 this.audioCtx.close().then(function() {
					this.audioCtx = null;
					if (this.leftChannel != null)
					{
						for(let i=0;i<this.leftChannel.length;i++)
						{
							this.leftChannel[i] = null;
						}
						this.leftChannel.length = 0;
						this.leftChannel = null;
					}
					if (this.rightChannel != null)
					{
						for(let i=0;i<this.rightChannel.length;i++)
						{
							this.rightChannel[i] = null;
						}
						this.rightChannel.length = 0;
						this.rightChannel = null;
					}
				});
			} 
			if (_this.mediaStream != null)
			{
				let tracks = _this.mediaStream.getTracks();

				tracks.forEach(function(track) {
					track.stop();
				});
					
				_this.mediaStream = null;
			}
			
		}
		this.currentListeningState = MediaPlayStateEnum.ENDED;		
	}
}

SpeechToText.prototype.getRecognitionText = function()
{
	return this.recognizedText;
	
}

SpeechToText.prototype.dispose = function(){
	this.parentSide = null;
	this.UID = null;
	this.userData = null;
	if (g_isSpeechToTextCompatibleDevice)
	{
		if (this.currentListeningState == MediaPlayStateEnum.RECORDING)
		{
			if (this.recognition != null)
			{
				this.recognition.abort();
			}
		}
		this.recogniseStartStatePresent = false;
		this.recogniseOnResultStatePresent = false;
		this.recogniseOnErrorStatePresent = false;
		this.recogniseOnEndStatePresent = false;
		this.recognition = null;
		this.recognizedText = null;	
		this.recogniseStartState = null;
		this.recogniseOnResultState = null;
		this.recogniseOnErrorState = null;
		this.recogniseOnEndState = null;
	}
	else
	{
		if (this.currentListeningState == MediaPlayStateEnum.RECORDING)
		{
			this.stopListening(false);
		}
		
		if (this.mediaStream != null)
		{
			let tracks = this.mediaStream.getTracks();

			tracks.forEach(function(track) {
				track.stop();
			});
			
			this.mediaStream = null;
		}
		if (this.audioCtx != null)
		{
			 this.audioCtx.close().then(function() {
				this.audioCtx = null;
				if (this.leftChannel != null)
				{
					for(let i=0;i<this.leftChannel.length;i++)
					{
						this.leftChannel[i] = null;
					}
					this.leftChannel.length = 0;
					this.leftChannel = null;
				}
				if (this.rightChannel != null)
				{
					for(let i=0;i<this.rightChannel.length;i++)
					{
						this.rightChannel[i] = null;
					}
					this.rightChannel.length = 0;
					this.rightChannel = null;
				}
			});
		} 

	}

}

//NPL Engine (DialogFlow)

DialogEngine = function(item, parentside) {
	var _this = this;
	this.UID = null;
	this.userData = null;
	this.parentSide = parentside;
	this.dialogClient = null;
	this.dialogResponseText = null;
	this.timer = null;
	this.timerDuration = 5000;
	this.dialogTimeoutStatePresent = false;
	this.dialogTimeoutState = null;
	this.dialogResultStatePresent = false;
	this.dialogResultState = null;
	this.dialogErrorStatePresent = false;
	this.dialogErrorState = null;
	this.speechtotext = null;
	this.dialogFlowVersion = 0;
	this.dialogResponse = null;
	
	if (item.hasOwnProperty('uid'))
	{
		this.UID = item.uid;
		this.parentSide.setUIDObjectMap(item.uid, _this, ObjectTypeEnum.DIALOGENGINE);
	}
	
	if (item.hasOwnProperty('userdata'))
	{
		this.userData = item.userdata;
	}
	
	if (item.hasOwnProperty('apitoken'))
	{
		this.dialogClient = new ApiAi.ApiAiClient({accessToken: item.apitoken});
		this.dialogFlowVersion = 1;
	}
	else
	{
		if (item.hasOwnProperty('private_key'))
		{
			console.log("item.private_key " + item.private_key);
			this.serviceAccountPrivateKey = item.private_key;
			this.dialogFlowVersion = 2;
		}
		
		if (item.hasOwnProperty('client_email'))
		{
			this.serviceAccountEmail = item.client_email;
		}
		
		if (item.hasOwnProperty('project_id'))
		{
			this.projectID = item.project_id;
		}
		
		if (item.hasOwnProperty('session_id'))
		{
			this.sessionID = item.session_id;
		}
	}
	
	class ClaimSet {
		constructor(scopes, issuerEmail) {
			this.scopes = scopes;
			this.issuerEmail = issuerEmail;
			//this.audienceURL = "https://accounts.google.com/o/oauth2/token";
			this.audienceURL = "https://www.googleapis.com/oauth2/v4/token";
			this.duration = 60 * 60 * 1000;
		}
		ToSpecClaimSet() {
			const issuedAtTime = this.issuedAtTime || Date.now();
			const expireAtTime = issuedAtTime + this.duration;
			return {
				scope: this.scopes.join(" "),
				iss: this.issuerEmail,
				sub: this.delegationEmail,
				aud: this.audienceURL,
				iat: Math.floor(issuedAtTime / 1000),
				exp: Math.floor(expireAtTime / 1000),
			};
		}
	}
	
	function GetAssertion(claimSet, privateKey) {
		var header = { alg: "RS256", typ: "JWT" };
		//let jws = new KJUR.jws.JWS();
		/*const prv = KEYUTIL.getKey(privateKey);
		return KJUR.jws.JWS.sign(header.alg, header, claimSet, prv);*/
		return KJUR.jws.JWS.sign(header.alg, header, claimSet.ToSpecClaimSet(), privateKey);
	}
	const claimSetPlusPK_cachedData = {};
	async function GetAccessToken(claimSet, privateKey) {
		const claimSetPlusPK_json = JSON.stringify({ claimSet, privateKey });
		// if access-token is not cached, or cached token is expired (expires after 60m, but we get new one at 59m to be safe)
		const cachedData = claimSetPlusPK_cachedData[claimSetPlusPK_json];
		if (cachedData == null || Date.now() - cachedData.cacheTime > 59 * 60 * 1000) {
			var assertion = GetAssertion(claimSet, privateKey);
			const response = await fetch("https://www.googleapis.com/oauth2/v4/token", {
				method: "POST",
				headers: {
					//"content-type": "application/x-www-form-urlencoded",
					"content-type": "application/json",
				},
				//body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${assertion}`,
				body: JSON.stringify({
					grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
					assertion,
				}),
			});
			const responseJSON = await response.json();
			console.log(`Got access token: ${responseJSON.access_token}`);
			claimSetPlusPK_cachedData[claimSetPlusPK_json] = { accessToken: responseJSON.access_token, cacheTime: Date.now() };
		}
		return claimSetPlusPK_cachedData[claimSetPlusPK_json].accessToken;
	}
	
	
	this.dialogResponse = async function DialogFlowResponse(textMessage) {
		console.log("DialogFlowResponse called " + textMessage);
		const languagecode = 'en-GB';
		try {
			const claimSet = new ClaimSet(["https://www.googleapis.com/auth/cloud-platform"], this.serviceAccountEmail);
			const accessToken = await GetAccessToken(claimSet, this.serviceAccountPrivateKey);
			const response = await fetch(`https://dialogflow.googleapis.com/v2beta1/projects/${this.projectID}/agent/sessions/${this.sessionID}:detectIntent`, {
				method: "POST",
				headers: {
					authorization: `Bearer ${accessToken}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({
						queryInput: {
						text: {
							text: textMessage,
							languageCode: languagecode
						}
		 
					}

				}),
			});
			const responseJSON = await response.json();
			window.clearTimeout(_this.timer);
			//console.log("Got responseJSON: ", responseJSON);
			_this.dialogResponseText = responseJSON.queryResult.fulfillmentText;
			console.log("dialogResponseText " + _this.dialogResponseText);
			if (_this.dialogResultStatePresent)
			{
				
				console.log("_this.dialogResultState.setActive");
				_this.dialogResultState.setActive();
			}
		}
		catch(err) {
			window.clearTimeout(_this.timer);
			if (_this.dialogErrorStatePresent)
			{
				
				_this.dialogErrorState.setActive();
			}
			console.log("Error from api.ai server: ", serverError);
		}
    //const speechText = responseJSON.queryResult.queryText || "";
    //return speechText;
	}
	
	
	if (item.hasOwnProperty('timeout'))
	{
		this.timerDuration = item.timeout;
	}
	
	this.timeout = function() {
		if (_this.dialogTimeoutStatePresent)
		{
			_this.dialogTimeoutState.setActive();
		}
	}
	
	this.handleResponse = function (serverResponse) {
		window.clearTimeout(_this.timer);
		// Set a timer just in case. so if there was an error speaking or whatever, there will at least be a prompt to continue
		

		_this.dialogResponseText = serverResponse["result"]["fulfillment"]["speech"];
		console.log("dialogResponseText " + _this.dialogResponseText);
		if (_this.dialogResultStatePresent)
		{
			
			console.log("_this.dialogResultState.setActive");
			_this.dialogResultState.setActive();
		}

	}
	
	this.handleError = function(serverError) {
		window.clearTimeout(_this.timer);
		if (_this.dialogErrorStatePresent)
		{
			
			_this.dialogErrorState.setActive();
		}
		console.log("Error from api.ai server: ", serverError);
	} 

}

DialogEngine.prototype.constructor = DialogEngine;

DialogEngine.prototype.getType = function(){
	return ObjectTypeEnum.DIALOGENGINE;
}

DialogEngine.prototype.getUID = function(){	
	return this.userData
}

DialogEngine.prototype.getUserData = function(){	
	return this.userData
}

DialogEngine.prototype.response = function(input = null, inputuid = null, dialogresultstateuid = null, dialogtimeoutstateuid = null, dialogerrorstateuid = null)
{
	var _this = this;
	var recognitiontext = null;
	if (input != null)
	{
		recognitiontext = input;
	}
	else if (inputuid != null)
	{
		var speechtext = this.parentSide.getUIDObjectMap(inputuid, ObjectTypeEnum.SPEECHTOTEXT);
		if (speechtext != null)
		{
			recognitiontext = speechtext.getRecognitionText();
		}
	}
		
	if (recognitiontext != null)
	{

		this.dialogResultStatePresent = false;
		this.dialogResultState = null;
		if (dialogresultstateuid != null)
		{
			this.dialogResultState = this.parentSide.getUIDObjectMap(dialogresultstateuid, ObjectTypeEnum.STATE);
			if (this.dialogResultState != null)
			{
				this.dialogResultStatePresent = true;
			}
		}
		this.dialogTimeoutStatePresent = false;
		this.dialogTimeoutState = null;
		if (dialogtimeoutstateuid != null)
		{
			this.dialogTimeoutState = this.parentSide.getUIDObjectMap(dialogtimeoutstateuid, ObjectTypeEnum.STATE);
			if (this.dialogTimeoutState != null)
			{
				this.dialogTimeoutStatePresent = true;
			}
		}
		this.dialogErrorStatePresent = false;
		this.dialogErrorState = null;
		if (dialogerrorstateuid != null)
		{
			this.dialogErrorState = this.parentSide.getUIDObjectMap(dialogerrorstateuid, ObjectTypeEnum.STATE);
			if (this.dialogErrorState != null)
			{
				this.dialogErrorStatePresent = true;
			}
		}
		if (this.dialogFlowVersion == 1)
		{
			let promise = this.dialogClient.textRequest(recognitiontext);
			this.timer = window.setTimeout(function() { _this.timeout(); }, this.timerDuration);
			promise
				.then(this.handleResponse)
				.catch(this.handleError);
		}
		if (this.dialogFlowVersion == 2)
		{
			this.timer = window.setTimeout(function() { _this.timeout(); }, this.timerDuration);
			this.dialogResponse(recognitiontext);
		}
	}

}

DialogEngine.prototype.getDialogResponseText = function(){
	return this.dialogResponseText;

}

DialogEngine.prototype.dispose = function(){
	window.clearTimeout(this.timer);
	this.parentSide = null;
	this.dialogClient = null;
	this.UID = null;
}