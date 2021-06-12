# Node StreamCam

An express Nodejs server with UI to stream a webcam from a Raspberry Pi Zero W (or WH)

## Prerequisites

### Mjpg-streamer
See the [documentation](docs/Mjpg-streamer.md)

### Wiring Pi (optional)
Optional if you want to control the IR leds.  
See installation instructions here -> [Wiring Pi](http://wiringpi.com/download-and-install/)  
This library is deprecated but fully functional, howerver you can try this one -> (pigpio library)(http://abyz.me.uk/rpi/pigpio/index.html)

### Install NodeJs

Tutorial here -> https://danidudas.medium.com/how-to-install-node-js-and-npm-on-raspberry-pi-zero-or-other-arm-v6-device-220d0392a426

### Activate Camera
```
sudo raspi-config
```
Interface options -> Camera -> Yes -> Finish -> Reboot

## Setup

Follow setup instructions here : [Setup](docs/Setup.md)

## Confguration

Follow configuration instructions here : [Configuration](docs/Configuration.md)

## Authors
[Sébastien Lorrain](https://github.com/sldevand)

## License
This Project is under MIT [LICENSE](LICENSE.md)
