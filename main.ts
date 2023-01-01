
enum MP3BoardCMD {
    STOP = 0x0E,
    SET_VOLUME = 0x31,
    SEL_DEV = 0x35,
    PLAY_W_INDEX = 0x41,
    PLAY_FILE_NAME = 0x42,
    INJECT_W_INDEX = 67
}

/**
 * Provides access to MP3Board micro:bit functionality.
 */
//% color=190 weight=100 icon="\uf001" block="Serial Control USB MP3 Board"
namespace MP3Board {
    const DEV_TF = 1

    let isConnected: boolean = false;

    function send5Byte(command: MP3BoardCMD, dat: number) {
        const buffer = Buffer.create(5);
        buffer.setUint8(0, 0x7e);
        buffer.setUint8(1, 0x03);
        buffer.setUint8(2, command);
        buffer.setUint8(3, dat);
        buffer.setUint8(4, 0xef);
        serial.writeBuffer(buffer);
        basic.pause(20);
    }

    function send4Byte(command: MP3BoardCMD) {
        let buffer = Buffer.create(4);
        buffer.setUint8(0, 0x7e);
        buffer.setUint8(1, 0x02);
        buffer.setUint8(2, command);
        buffer.setUint8(3, 0xef);
        serial.writeBuffer(buffer)
        basic.pause(20)
    }

    function send6Byte(command: MP3BoardCMD, dat: number) {
        let buffer = Buffer.create(6);
        buffer.setUint8(0, 0x7e);
        buffer.setUint8(1, 0x04);
        buffer.setUint8(2, command);
        buffer.setUint8(3, (dat >> 8));
        buffer.setUint8(4, dat);
        buffer.setUint8(5, 0xef);
        serial.writeBuffer(buffer)
        basic.pause(20)
    }

    /**
     * Connect Serial Control USB MP3
     * @param pinTX TX Pin, eg: SerialPin.P1
     * @param pinRX RX Pin, eg: SerialPin.P2
     */
    //% blockId="serial_control_usb_mp3_connect" block="MP3 보드에 연결하기, TX:%pinTX|RX:%pinRX"
    //% weight=100 blockGap=20
    export function connect(pinTX: SerialPin = SerialPin.P1, pinRX: SerialPin = SerialPin.P2): void {
        serial.redirect(pinRX, pinTX, BaudRate.BaudRate9600)
        isConnected = true
        basic.pause(100)
        send5Byte(MP3BoardCMD.SEL_DEV, DEV_TF)
    }

    /**
     * Setting Volume Serial Control USB MP3
     * @param volume Voulume, eg: 30
     */
    //% blockId="serial_control_usb_mp3_set_volume" block="볼륨 설정하기, Volume:%volume"
    //% weight=100 blockGap=20
    export function setVolume(volume: number) {
        if (!isConnected)
            return;
        send5Byte(MP3BoardCMD.SET_VOLUME, volume)
    }

    /**
     * Play With Index Serial Control USB MP3
     * @param index play with index, eg: SerialPin.P0;
     */
    //% blockId="serial_control_usb_mp3_play_with_index" block="재생하기, Index:%index"
    //% weight=100 blockGap=20
    export function playWithIndex(index: number) {
        if (!isConnected)
            return;
        send6Byte(MP3BoardCMD.PLAY_W_INDEX, index)
    }

    /**
     * Play With Folder And FileName Serial Control USB MP3
     * @param index play with folder name and file name, eg: 1, 1 /01/001xxx.mp3 1, 2 /01/002xxx.mp3;
     */
    //% blockId="serial_control_usb_mp3_play_with_folder_name_file_name" block="재생하기, 폴더:%folderName,파일:%fileName"
    //% weight=100 blockGap=20
    export function playWithFolderNameFileName(folderName: number, fileName: number) {
        if (!isConnected)
            return;
        send6Byte(MP3BoardCMD.PLAY_FILE_NAME, ((folderName & 0xff) << 8) | (fileName & 0xff))
    }

    /**
     * Play Stop Serial Control USB MP3
     */
    //% blockId="serial_control_usb_mp3_stop_lay" block="재생중지"
    //% weight=100 blockGap=20
    export function stopPlay() {
        if (!isConnected)
            return;
        send4Byte(MP3BoardCMD.STOP)
    }
}