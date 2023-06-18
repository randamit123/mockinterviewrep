async function getTextToSpeech(text) {
    var apiKey = '3adbbe3ad3f423b859e1edc87cd51959';
    var voiceId = '21m00Tcm4TlvDq8ikWAM';
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
            'accept': 'audio/mpeg',
            'xi-api-key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'text': text,
            'model_id': 'eleven_monolingual_v1',
            'voice_settings': {
                'stability': 0.4,
                'similarity_boost': 0.8
            }
        })
    })

    const blob = await response.blob()
    const audioUrl = URL.createObjectURL(blob);
    return audioUrl
}