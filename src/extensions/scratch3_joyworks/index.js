const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const MathUtil = require('../../util/math-util');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');


const blockIconURI = 'data:image/png;base64,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';
const BLETimeout = 4500;
const BLESendInterval = 100;
const BLEDataStoppedError = 'Joyworks J1 extension stopped receiving data';

const BLEUUID = {
    // joy_motor_service: '0e9cf922-90d2-11ed-a1eb-0242ac120002',
    // joy_motor_set_char: 'fde7ec45-a39f-4b66-877e-af4efe95d679',
    // joy_sensor_service: 'c10594b1-01a7-4148-ac97-670fdc5c71e4',
    // joy_sensor_data_char: '1bb9839b-16b7-42bc-8ef3-b419d6b02c9a',

    joy_motor_service:      0xee05,
    joy_motor_set_char:     '34443d33-3356-11e9-b210-d663bd873d93',
    joy_motor_servo_char:   '34443d34-3356-11e9-b210-d663bd873d93',
    joy_sensor_service:     0xee07,
    joy_sensor_data_char:   '34443d3c-3356-11e9-b210-d663bd873d93',

    joy_misc_service:  0xee08,
    //joy_multi_port_char:    "34443d3d-3356-11e9-b210-d663bd873d93",
    //joy_multi_led_char:     "34443d3e-3356-11e9-b210-d663bd873d93"

   
};

const ServoNo = {
    SERVO_1: 'Servo 1',
    SERVO_2: 'Servo 2'
}

// const MultiPort = {
//     SOUND:  'Sound',
//     LED:    'LED',
//     BUZZER: 'Buzzer',
//     SWITCH: 'Switch'
// }

// const LedOnoff = {
//     OFF: 'OFF',
//     ON:  'ON'
// }


class Joyworks {

    constructor (runtime, extensionId) {
        console.log("test-1 hello world ");
        this._runtime = runtime;
        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);
        this._extensionId = extensionId;

        this._timeoutID = null;
        this._busy = false;
        this._busyTimeoutID = null;

        this.disconnect = this.disconnect.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);

        this._offset = 0;
        this._ultra_dist = 0;
        this._ir1 = 0;
        this._ir2 = 0;
        //this._multi_port_use = MultiPort.SOUND;
        this._sound = 0;

    }   

    

    scan () {
        if (this._ble) {   
            this._ble.disconnect();
        }
        console.log('scanning...');
        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: [
                {services: [BLEUUID.joy_motor_service, BLEUUID.joy_sensor_service, BLEUUID.joy_misc_service]}
            ]
        }, this._onConnect, this.reset);
    }

    connect (id) {
        if (this._ble) {
            this._ble.connectPeripheral(id);
            console.log('connect...');
        }
    }

    disconnect () {
        if (this._ble) {
            this._ble.disconnect();
            console.log('disconnect...');
        }
    }

    reset () {
        console.log('reset...');
        if (this._timeoutID) {
            window.clearTimeout(this._timeoutID);
            this._timeoutID = null;
        }
    }

    isConnected () {
        let connected = false;
        if (this._ble) {
            connected = this._ble.isConnected();
        } 
        return connected;
    }

    send (service, characteristic, value) {
        if (!this.isConnected()) return;
        if (this._busy) return;

        this._busy = true;
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
        }, 5000);

        const data = Base64Util.uint8ArrayToBase64(value);
        this._ble.write(service, characteristic, data, 'base64', false).then(
            () => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
            }
        );
    }


    _onConnect () {
        console.log('_onConnect');
        this._ble.read(BLEUUID.joy_motor_service, BLEUUID.joy_sensor_data_char, true, this._onMessage);
        this._timeoutID = window.setTimeout(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }

    _onMessage (base64) {
        const data = Base64Util.base64ToUint8Array(base64);

        this._ultra_dist = ((data[1] << 8) + data[0]) & 0xFFFF;
        this._ir1 = data[2] & 0xff;
        this._ir2 = data[3] & 0xff;
        this._sound = data[4] & 0xff;
        console.log("onMessage")
        
        window.clearTimeout(this._timeoutID);
        this._timeoutID = window.setTimeout(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }

    setMotor(left, right, direction){
        var send_data = [];

        send_data.push((left >> 24) & 0xFF);
        send_data.push((left >> 16) & 0xFF);
        send_data.push((left >> 8) & 0xFF);
        send_data.push((left) & 0xFF);
        send_data.push((right >> 24) & 0xFF);
        send_data.push((right >> 16) & 0xFF);
        send_data.push((right >> 8) & 0xFF);
        send_data.push((right) & 0xFF);
        send_data.push((direction) & 0xFF);
       
        return this.send(BLEUUID.joy_motor_service, BLEUUID.joy_motor_set_char, send_data);

    }

    setServo(angle, servo){
        var send_data = [];

        send_data.push((angle >> 24) & 0xFF);
        send_data.push((angle >> 16) & 0xFF);
        send_data.push((angle >> 8) & 0xFF);
        send_data.push((angle) & 0xFF);
        if(servo == ServoNo.SERVO_1)
            send_data.push(0x01);
        else
            send_data.push(0x02);
        return this.send(BLEUUID.joy_motor_service, BLEUUID.joy_motor_servo_char, send_data);

    }

    // setPort(port){
    //     var send_data = [];
    //     if(port == MultiPort.SOUND){
    //         send_data.push(0x01);
    //         console.log("sound");
    //     }else if(port == MultiPort.LED){
    //         send_data.push(0x02);
    //         console.log("LED");
    //     }else if(port == MultiPort.SWITCH){
    //         send_data.push(0x03);
    //         console.log("SWITCH");
    //     }else if(port == MultiPort.BUZZER){
    //         send_data.push(0x04);
    //         console.log("BUZZER");
    //     } 
    //     console.log("setPort");
    //     return this.send(BLEUUID.joy_misc_service, BLEUUID.joy_multi_port_char, send_data);
    // }

    // setLED(led){
    //     var send_data = [];
    //     if(led == LedOnoff.ON){
    //         console.log('LED on');
    //         send_data.push(0x01);
    //     }else if(led == LedOnoff.OFF){
    //         console.log('LED off');
    //         send_data.push(0x02);
    //     }
    //     return this.send(BLEUUID.joy_misc_service, BLEUUID.joy_multi_led_char);
    // }
}

/**
 * Scratch 3.0 blocks to interact with a Joyworks J1 peripheral.
 */
class Scratch3JoyworksBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'Joyworks';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'joyworks';
    }


    /**
     * Construct a set of Joyworks J1 blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new MicroBit peripheral instance
        this._peripheral = new Joyworks(this.runtime, Scratch3JoyworksBlocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3JoyworksBlocks.EXTENSION_ID,
            name: Scratch3JoyworksBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
               
                {
                    opcode: 'moveForward',
                    text: formatMessage({
                        id: 'joyworks.moveForward',
                        default: 'move forward [SPEED]%',
                        description: 'move forward Joyworks robot'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'turnLeft',
                    text: formatMessage({
                        id: 'joyworks.turnLeft',
                        default: 'turn left [SPEED]%',
                        description: 'turn left Joyworks robot'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'turnRight',
                    text: formatMessage({
                        id: 'joyworks.turnRight',
                        default: 'turn right [SPEED]%',
                        description: 'turn right Joyworks robot'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'stopMotor',
                    text: formatMessage({
                        id: 'joyworks.stopMotor',
                        default: 'stop motor',
                        description: 'stop motor of Joyworks robot'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                    }
                },
                '---',
                {
                    opcode: 'getUltraSonic',
                    text: formatMessage({
                        id: 'joyworks.getUltraSonic',
                        default: 'get ultra sonic sensor',
                        description: 'get ultra sonic sensor value'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                    }
                },
                {
                    opcode: 'getIR1',
                    text: formatMessage({
                        id: 'joyworks.getIR1',
                        default: 'get infra red 1 sensor',
                        description: 'get infra red 1 sensor digital value'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                    }
                },
                {
                    opcode: 'getIR2',
                    text: formatMessage({
                        id: 'joyworks.getIR2',
                        default: 'get infra red 2 sensor',
                        description: 'get infra red 2 sensor digital value'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                    }
                },
                {
                    opcode: 'getSound',
                    text: formatMessage({
                        id: 'joyworks.getSound',
                        default: 'get sound sensor',
                        description: 'get sound sensor digital value'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                    }
                },
                '---',
                {
                    opcode: 'moveServo',
                    text: formatMessage({
                        id: 'joyworks.moveServo',
                        default: 'move [SERVO_NO] [ANGLE] degree',
                        description: 'move Joyworks servo'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SERVO_NO: {
                            type: ArgumentType.STRING,
                            menu: 'SERVO_NO',
                            defaultValue: ServoNo.SERVO_1
                        },
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                '---',
                // {
                //     opcode: 'selectMultiPort',
                //     text: formatMessage({
                //         id: 'joyworks.selectMultiPort',
                //         default: 'use multiport as  [MULTI_PORT]',
                //         description: 'select multiport usage - LED, sound sensor, buzzer, button'
                //     }),
                //     blockType: BlockType.COMMAND,
                //     arguments: {
                //         MULTI_PORT: {
                //             type: ArgumentType.STRING,
                //             menu: 'MULTI_PORT_USE',
                //             defaultValue: MultiPort.SOUND
                //         },
                //     }
                // },
                // {
                //     opcode: 'turnLED',
                //     text: formatMessage({
                //         id: 'joyworks.turnLED',
                //         default: 'turn LED  [LED_ONOFF]',
                //         description: 'turn on/off LED on multi port'
                //     }),
                //     blockType: BlockType.COMMAND,
                //     arguments: {
                //         LED_ONOFF: {
                //             type: ArgumentType.STRING,
                //             menu: 'LED_ONOFF_USE',
                //             defaultValue: LedOnoff.OFF
                //         },
                //     }
                // }
            ],
            menus: {
                SERVO_NO: [
                    {
                        text: formatMessage({
                            id: 'joyworks.servono.SERVO_1',
                            default: 'SERVO_1',
                            description: "label for servo motor 1 of joyworks robot"
                        }),
                        value: ServoNo.SERVO_1
                    },
                    {
                        text: formatMessage({
                            id: 'joyworks.servono.SERVO_2',
                            default: 'SERVO_2',
                            description: "label for servo motor 2 of joyworks robot"
                        }),
                        value: ServoNo.SERVO_2
                    },
                ],
                // MULTI_PORT_USE: [
                //     {
                //         text: formatMessage({
                //             id: 'joyworks.multiportuse.SOUND',
                //             default: 'SOUND',
                //             description: "label for using multi port as sound sensor"
                //         }),
                //         value: MultiPort.SOUND
                //     },
                //     {
                //         text: formatMessage({
                //             id: 'joyworks.multiportuse.LED',
                //             default: 'LED',
                //             description: "label for using multi port as LED"
                //         }),
                //         value: MultiPort.LED
                //     },
                //     {
                //         text: formatMessage({
                //             id: 'joyworks.multiportuse.SWITCH',
                //             default: 'SWITCH',
                //             description: "label for using multi port as tact switch"
                //         }),
                //         value: MultiPort.SWITCH
                //     },
                //     {
                //         text: formatMessage({
                //             id: 'joyworks.multiportuse.BUZZER',
                //             default: 'BUZZER',
                //             description: "label for using multi port as buzzer"
                //         }),
                //         value: MultiPort.BUZZER
                //     },
                // ],
                // LED_ONOFF_USE: [
                //     {
                //         text: formatMessage({
                //             id: 'joyworks.ledonoff.ON',
                //             default: 'ON',
                //             description: "label for LED ON on multi port"
                //         }),
                //         value: LedOnoff.ON
                //     },
                //     {
                //         text: formatMessage({
                //             id: 'joyworks.ledonoff.off',
                //             default: 'OFF',
                //             description: "label for LED OFF on multi port"
                //         }),
                //         value: LedOnoff.OFF
                //     },
                // ],
            }
        };
        
    }
    moveForward (args) {
        var speed = MathUtil.clamp(Cast.toNumber(args.SPEED), 0, 100);
        if (speed > 100)
            speed = 100;
        this._peripheral.setMotor(speed, speed, 0x01);
    }

    stopMotor () {
        this._peripheral.setMotor(0, 0, 0x03);
    }

    turnLeft (args) {
        speed = MathUtil.clamp(Cast.toNumber(args.SPEED), 0, 100);
        this._peripheral.setMotor(speed, 0, 0x04);
    }

    turnRight (args) {
        speed = MathUtil.clamp(Cast.toNumber(args.SPEED), 0, 100);
        this._peripheral.setMotor(0, speed, 0x05);
    }

    moveServo(args){
        console.log(args);
        var servo = String(args.SERVO_NO)
        console.log("Servo: "+servo);
        angle = MathUtil.clamp(Cast.toNumber(args.ANGLE), 0, 180);
        this._peripheral.setServo(angle, servo);
    }

    getUltraSonic () {
        return this._peripheral._ultra_dist;
    }

    getIR1 () {
        return this._peripheral._ir1;
    }

    getIR2 () {
        return this._peripheral._ir2;
    }

    getSound () {
        return this._peripheral._sound;
    }

    // selectMultiPort(args){
    //     console.log(args);
    //     var port = String(args.MULTI_PORT);
    //     console.log("select port "+port);
    //     this._peripheral.setPort(port);
    // }

    // turnLED(args){
    //     console.log(args);
    //     var led = String(args.LED_ONOFF);
    //     this._peripheral.setLED(led);
    // }
    
}

module.exports = Scratch3JoyworksBlocks;
