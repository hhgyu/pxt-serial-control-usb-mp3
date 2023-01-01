// tests go here; this will not be compiled when this package is used as an extension.
MP3Board.connect(SerialPin.P0, SerialPin.P1)
MP3Board.setVolume(30)
while (true) {
    MP3Board.playWithIndex(1)
    basic.pause(5000)
    MP3Board.stopPlay()
    basic.pause(5000)
}
